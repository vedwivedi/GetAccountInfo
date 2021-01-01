const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.greeting_task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = true;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);
    
    let userPhoneNumber = event.UserIdentifier;
    //if(userPhoneNumber === undefined)
        userPhoneNumber="+14151234567";
    
    let TFN = event.UserIdentifier;
    let bTFn_success = false;
    if(TFN === undefined)
    {
      bTFn_success = false;
        //go to agent 
        //return
    }
    else
    {
      TFN = '8559092691';
      Remember.TFN = '8559092691';
      Remember.user_phone_number = userPhoneNumber;
      userPhoneNumber = userPhoneNumber.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      const { success, clientRespData } = await TFN_Lookup(userPhoneNumber,TFN);
      console.log(clientRespData);
  
      if ( success ) {
        bTFn_success = true;
        const clientData = {
          clientName: clientRespData.ClientName,
          mailingAddress: clientRespData.MailingAddress,
          webPaymentAddress: clientRespData.WebPaymentAddress,
          transferAgentNumber: clientRespData.TransferAgentNumber,
          namespace: clientRespData.NameSpace,
          channel: clientRespData.Channel,
          host: clientRespData.Host,
          TFN: clientRespData.PhoneNumber,
          user_phone_number: clientRespData.PhoneNumberTo,
          //first namespace letter
          F_Letter_Namespace: "R"
          //clientRespData.NameSpace.substring((clientRespData.NameSpace.length +1),clientRespData.NameSpace.length);
        };
        Remember.user_phone_number=clientRespData.PhoneNumberTo;
        Remember.clientData = clientData;
      }
      else
      {
        Say = `Thank you for calling. There was a problem with the call. `;
        Listen = true;
        Collect = false;
        Redirect = true;
        Redirect = `task://agent_transfer` ;
      }
    }

  /// GetAccountInfo throufh user phone
    if ( Remember.user_phone_number && bTFn_success ) {

     // userPhoneNumber = userPhoneNumber.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  
     const reqData = {
      accountNumber: Memory.AccountNo,
      namespace: Remember.clientData.namespace,
      host: Remember.clientData.host,
      callerPhoneNumber: Remember.user_phone_number,
      TFN: Remember.TFN
    };
      
      const { success, userRespData } = await GetInboundAccountInfo(reqData);

      if ( success ) {
        const userData = {
          userName: userRespData.FullName,
          userZip: userRespData.ZipCd,
          userSsnLastFour: userRespData.SSNLastFour,
          accountNumber: userRespData.SeedAcct,
          accountStatus: userRespData.AccStatus === '1' ? true : false,
          userTotalBalance: +userRespData.TotalBalance
        };

        Remember.userData = userData;
        
  
      } else {
        
        Collect= {
          "name": "collect_Accountnumber",
          "questions": [
                  {
                  "question": `Please enter your Account Number or say. your first digit is ${Remember.clientData.F_Letter_Namespace}. located in the  upper right corner of the letter or in the body of the SMS you received, starting with the first numerical digit.`,
                  //"prefill": "NumberOfacct",
                  "name": "NumberOfacct",
                  "voice_digits": {
                    "num_digits": 20,
                    "finish_on_key": "#"
                    
                  },
                  
                  "validate": {
                    "on_failure": {
                      "messages": [
                        {
                          "say": "Sorry, that's not a valid account ."
                        },
                        {
                          "say": "Hmm, I'm not understanding. "
                        }
                      ],
                      "repeat_question": true
                    },
                    "webhook": {
                      "url": "https://getaccountinfo-8115-dev.twil.io/ValidateAccount",
                      "method": "POST"
                    },
                    "on_success": {
                      "say": "Great, we've got your account details"
                    },
                    "max_attempts": {
                      "redirect": "task://agent_transfer",
                      "num_attempts": 3
                    }
                  }
                  }
    
                ],
          "on_complete": {
          "redirect": 	 "task://getAccount"
                  }
        };
        
        
      }

    }

    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
  const TFN_Lookup = async ( phoneNumber,TFN ) => {
    let clientRespData;
    let success;
    
    try {
      const requestObj = {
        PhoneNumber: TFN,
        PhoneNumberTo: phoneNumber
      };
  
      const responseObj = await axios.post(`${API_ENDPOINT}/TFN_LookUp`, requestObj);
      clientRespData = responseObj.data;
      success = clientRespData.status === 'ok' ? true : false;
      
    } catch ( error ) {
      console.error( error.response );
      success = false;
    }
  
    return { success, clientRespData };
  };
  
  const GetInboundAccountInfo = async ( reqData ) => {
    let userRespData;
    let success;
    
    try {
      const requestObj = {
        'AccountNo': reqData.callerPhoneNumber,  // A/C number the caller entered. Or the caller’s phone number
        'NameSpace':reqData.namespace,  // coming from the result of TFN_LookUp
        'AccountType': 'P', // hard coded 
        'NameType': 'P',  // hard coded
        'SeedFlag': '1',  // hard coded
        'Host': reqData.host, // coming from the result of TFN_LookUp
        'PhoneNumber': reqData.TFN, // caller’s phone number
        'PhoneNumberTo': reqData.callerPhoneNumber, // the phone number they are calling to
        'IVRUsed':'MainIVR'
      };
  
      const responseObj = await axios.post(`${API_ENDPOINT}/GetInboundAccountInfo`, requestObj);
      userRespData = responseObj.data;
  
      success = userRespData.Status === 'OK' ? true : false;
      
    } catch ( error ) {
      console.error( error.response );
      success = false;
    }
  
    return { success, userRespData };

  };
   
    
 