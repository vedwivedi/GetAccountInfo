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
   
    let userPhoneNumber ="";
    
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
      TFN="8559092691";
      const { success, clientRespData } = await TFN_Lookup(TFN);
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
          TFN: clientData.phoneNumber,
          user_phone_number: clientData.PhoneNumberTo,
          //first namespace letter
          F_Letter_Namespace: "R"
          //clientRespData.NameSpace.substring((clientRespData.NameSpace.length +1),clientRespData.NameSpace.length);
        };
  
        Remember.user_phone_number = clientData.user_phone_number;
        Remember.TFN = TFN;
        Remember.clientData = clientData;

      }
      else
      {
      Say = `Thank you for calling. 
                There was a problem with the call. `;
  
        Listen = false;
  
        Remember.TFN = TFN;
        
        Redirect = {"redirect": "task://agent_transfer" }
      }

    }

  /// GetAccountInfo throufh user phone
    if ( Remember.user_phone_number && bTFn_success ) {

     // userPhoneNumber = userPhoneNumber.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  
     const reqData = {
      accountNumber: Memory.AccountNo,
      namespace: Remember.clientData.namespace,
      host: Remember.clientData.host,
      callerPhoneNumber: Remember.user_phone_number
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
        Redirect={
          "redirect": "task://Account_Status"
        }
  
      } else {
        
        Collect= {
          "name": "collect_Accountnumber",
          "questions": [
                  {
                  "question": `Please enter your Account Number or say. your first digit is ${Remember.clientData.F_Letter_Namespace}. located in the  upper right corner of the letter or in the body of the SMS you received, starting with the first numerical digit.`,
                  "prefill": "NumberOfacct",
                  "name": "NumberOfacct",
                  
                  
                  "validate": {       
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
  const TFN_Lookup = async ( phoneNumber ) => {
    let clientRespData;
    let success;
    
    try {
      const requestObj = {
        PhoneNumber: Remember.user_phone_number, // UserNumber
        PhoneNumberTo: phoneNumber // TFN
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
        'PhoneNumber': reqData.callerPhoneNumber, // caller’s phone number
        'PhoneNumberTo': '+19993602702146', // the phone number they are calling to
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
   
    
 