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
    //let abc = Memory.twilio.collected_data.collect_comments.answers.answers;
    // let enterdigit = abc;// event.ValidateFieldAnswer;
    // console.log("enterdigit:" +enterdigit);
    
    // if(enterdigit === 2 ||  enterdigit=== 'no' || enterdigit=== 'No')
    // {
    //   Remember.userData.accountNumber = null;
    //   console.log("check : "+enterdigit);
    //   Redirect = true;
    //   Redirect = "task://getAccount" ;
    // }
    // else if(enterdigit === 1 ||  enterdigit=== 'yes' || enterdigit=== 'Yes')
    // {
    //   Redirect = true;
    //   Redirect = "task://ZipOrSSN_Taks" ;
    // }
    // else{
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
                    "1",
                    "No",
                    "2"
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
                  "num_attempts": 3
                }
              }
            }
          ],
          "on_complete": {
            "redirect": "task://ZipOrSSN_Taks"
          }
        };
      //}
    
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };

   
    
 