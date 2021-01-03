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
    console.log("name:");
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
          "name": "collect_comments",
          "questions": [
            {
              "question": `if your name is, ${name_check} ,,Please Press  1 or Say Yes to confirm your name, , press 2 or Say No,, if that is not your name  `,
              "name": "comments",
              "validate": {
                "allowed_values": {
                  "list": [
                    "Yes",
                    "1"
                  ]
                },
                "on_failure": {
                  "messages": [
                    {
                      "say": ""
                    }
                  ],
                  "repeat_question": false
                },
                "on_success": {
                  "say": ""
                },
                "max_attempts": {
                  "redirect": "task://agent_transfer",
                  "num_attempts": 0
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

   
    
 