const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.getAccount =async function(context, event, callback,RB) {
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
    
    Remember.task_fail_counter = 0;
    Remember.repeat = false;
  
    if ( userPhoneNumber ) {
      
        const reqData = {
          accountNumber: Memory.AccountNo,
          namespace: clientData.namespace,
          host: clientData.host,
          callerPhoneNumber: userPhoneNumber
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
  
          Say = `Thank you for calling ${clientData.clientName}.
                  Let me check your account using the phone number you are calling from. `;
  
          Remember.userData = userData;
  
          Listen = false;
          Redirect = "task://phone_check";
        } else {
          Collect = {
            "name": "collect_phone_num",
            "questions": [
              {
                "question": `Thank you for calling ${clientData.clientName}. 
                              We are not able to find your account using the phone number you are calling from. 
                              Please tell me the phone number associated with your account.`,
                "voice_digits": {
                  "finish_on_key": "#"
                },
                "name": "phone_num",
                "type": "Twilio.PHONE_NUMBER"
              }
            ],
            "on_complete": {
              "redirect": "task://phone_check"
            }
          };
          // Say = `Thank you for calling ${clientData.clientName}.
          //         We are not able to find your account using the phone number you are calling from. `;
          // Prompt = `Please tell me the phone number associated with your account.`;
  
          Say = false;
          Listen = false;
        }
  
      } else {
        Say = `Thank you for calling. 
                There was a problem with the call. `;
  
        Listen = false;
  
        Remember.user_phone_number = userPhoneNumber;
  
        Redirect = 'task://agent_transfer';
      }
  
    } else {
      Collect = {
        "name": "collect_phone_num",
        "questions": [
          {
            "question": `Thank you for calling. 
                          Let me check your account using your phone number. 
                          Please tell me the phone number associated with your account.`,
            "voice_digits": {
              "finish_on_key": "#"
            },
            "name": "phone_num",
            "type": "Twilio.PHONE_NUMBER"
          }
        ],
        "on_complete": {
          "redirect": "task://phone_check"
        }
      };
      // Say = `Thank you for calling. 
              // Let me check your account using your phone number. `;
      // Prompt = `Please tell me the phone number associated with your account.`;
  
      Say = false;
      Listen = false;
    }
  
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
  
  const TFN_Lookup = async ( phoneNumber ) => {
    let clientRespData;
    let success;
    
    try {
      const requestObj = {
        PhoneNumber: '8559092691',
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