const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.check_name_task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = true;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);
    let name_check = Memory.userData.userName;
    //event.ValidateFieldAnswer;
     
        // Collect= {
        //   "name": "collect_name_check",
        //   "questions": [
        //           {
        //           "question": `if your name is  ${name_check}. say yes or press 1 or say no or press 2.`,
        //           "prefill": "collect_name_check",
        //           "name": "collect_name_check",
        //           "voice_digits": {
        //             "num_digits": 5,
        //             "finish_on_key": "#"
                    
        //           },
                  
        //           "validate": {
        //             "on_failure": {
        //               "messages": [
        //                 {
        //                   "say": "Sorry, that's not a valid ."
        //                 },
        //                 {
        //                   "say": "Hmm, I'm not understanding. "
        //                 }
        //               ],
        //               "repeat_question": true
        //             },
        //             // "webhook": {
        //             //   "url": "https://getaccountinfo-8115-dev.twil.io/ValidateAccount",
        //             //   "method": "POST"
        //             // },
        //             "on_success": {
        //               "say": "Great, we've got your  details"
        //             },
        //             "max_attempts": {
        //               "redirect": "task://agent_transfer",
        //               "num_attempts": 3
        //             }
        //           }
        //           }
    
        //         ],
        //   "on_complete": {
        //   "redirect": 	 "task://ZipOrSSN_Taks"
        //           }
        // };

        Collect=  {
            "name": "collect_name_check",
            "questions": [
                {
                    "question": `if your name is  ${name_check}. say yes or press 1 or say no or press 2.`,
                    "name": "collect_name_check",
                    //"type": "Twilio.CITY",
                    "validate": {
                        "allowed_values": {
                            "list": [
                                "Yes",
                                "No"
                            ]
                        },
                        "on_failure": {
                            "messages": [
                                {
                                    "say": "Sorry, that's not a valid "
                                },
                                {
                                    "say": "Hmm, I'm not understanding."
                                }
                            ],
                            "repeat_question": true
                        },
                        "on_success": {
                            "say": "Great, we've got."
                        },
                        "max_attempts": {
                            "redirect": "task://agent_transfer",
                            "num_attempts": 3
                        }
                    }
                }
                
            ],
            "on_complete": {
                "redirect": "task://ZipOrSSN_Taks"
            }
        };
    
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
   
    
 