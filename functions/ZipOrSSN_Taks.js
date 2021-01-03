const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.ZipOrSSN_Task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = true;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    console.log("inner function ZipOrSSN_Taks");
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

        Collect =  {
            "name": "collect_ziporssn",
            "questions": [
                    {
                    "question": `Please enter your ZIP or SSN Number or say.`,
                    //"prefill": "NumberOfacct",
                    "name": "ziporssn",
                    "voice_digits": {
                      "num_digits": 10,
                      "finish_on_key": "#"
                      
                    },
                    
                    "validate": {
                      "on_failure": {
                        "messages": [
                          {
                            "say": "Sorry, that's not a valid  ."
                          },
                          {
                            "say": "Hmm, I'm not understanding. "
                          }
                        ],
                        "repeat_question": true
                      },
                      "webhook": {
                        "url": "https://getaccountinfo-8115-dev.twil.io/validateziporssn",
                        "method": "POST"
                      },
                      "on_success": {
                        "say": "Great, we've got "
                      },
                      "max_attempts": {
                        "redirect": "task://agent_transfer",
                        "num_attempts": 3
                      }
                    }
                    }
      
                  ],
            "on_complete": {
            "redirect": 	 "task://set_MM"
                    }
          };
        

    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
 
  
    
 