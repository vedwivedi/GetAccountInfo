const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.getAccount_task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = true;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
  
    // Getting the real caller ID
    let userPhoneNumber = event.UserIdentifier;
    // console.log(userPhoneNumber);
    const Memory = JSON.parse(event.Memory);
    let AccountNo = "";
    Remember.user_phone_number = Memory.user_phone_number;
    Remember.clientData = Memory.clientData;
    let ReAccountNo = null;
    try{
     ReAccountNo = Memory.twilio.collected_data.collect_NameNotMatch.answers.NameNotMatch.answer;
    }
    catch
    {ReAccountNo = null}
    if(ReAccountNo === null)
    {
       AccountNo = Memory.twilio.collected_data.collect_Accountnumber.answers.NumberOfacct.answer;
       //AccountNo = AccountNo.slice(1);
    }
    else
    {
      AccountNo = ReAccountNo;
      //AccountNo = ReAccountNo.slice(1);
    }
    console.log("AccountNo:" +AccountNo);
    
    if(AccountNo === undefined)
        Memory.AccountNo="14296104";
   
    if ( AccountNo ) {
      console.log("ifAccountNo:"+ AccountNo);
        const reqData = {
          accountNumber: AccountNo,
          namespace: Remember.clientData.namespace,
          host: Remember.clientData.host,
          callerPhoneNumber: Remember.user_phone_number
        };
        
        const { success, userRespData } = await GetInboundAccountInfo(reqData);
  
        if ( success ) {
          console.log("successAccountNo:"+ AccountNo);
          const userData = {
            userName: userRespData.FullName,
            userZip: userRespData.ZipCd,
            userSsnLastFour: userRespData.SSNLastFour,
            accountNumber: userRespData.SeedAcct,
            accountStatus: userRespData.AccStatus === '1' ? true : false,
            userTotalBalance: +userRespData.TotalBalance
          };
          Remember.userData = userData;
          Say=false;
          Listen = false;
          Redirect = "task://check_name_task";
        }
          
     }
      else
      {
        //Say=`You dit't enter.`;
          //Redirect = "task://getAccount";
  
          //Listen = false;

        Collect =  {
            "name": "collect_Accountnumber",
            "questions": [
                    {
                    "question": `Please enter your account number starting with ${Remember.clientData.F_Letter_Namespace}, located in the upper right corner of the letter or in the body of the SMS you received. Enter the numerical digits after the letter ${Remember.clientData.F_Letter_Namespace}.`,
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
                            "say": "Sorry, that's not a valid account .",
                          },
                          {
                            "say": "Hmm, I'm not understanding. ",
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
    
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
   
  const GetInboundAccountInfo = async ( reqData ) => {
    let userRespData;
    let success;
    
    try {
      const requestObj = {
        'AccountNo': reqData.accountNumber,  // A/C number the caller entered. Or the caller’s phone number
        'NameSpace':reqData.namespace,  // coming from the result of TFN_LookUp
        'AccountType': 'F', // hard coded
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