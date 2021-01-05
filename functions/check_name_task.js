const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.check_name_task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);
    let name_check = Memory.userData.userName;
    let sQues = "";
    let Accountnumber = Memory.userData.accountNumber;

    if(Memory.AccountFrom == "Phone")
    {
      sQues = `if your name is, ${name_check}  and  your account number is ${Accountnumber},,Please Press  1 or Say Yes to confirm your name, , press 2 or Say No,, if that is not your name  `;
    }
    else
    {
       sQues = `if your name is, ${name_check} ,,Please Press  1 or Say Yes to confirm your name, , press 2 or Say No,, if that is not your name `;
    }

    Say = `${sQues}`;
    Listen = true;

        // Collect =  {
        //   "name": "collect_comments",
        //   "questions": [
        //     {
        //       "question": `${sQues}`,
        //       "name": "comments",
        //       "validate": {
        //         "allowed_values": {
        //           "list": [
        //             "Yes",
        //             "1",
        //             "No",
        //             "2"
        //           ]
        //         },
        //         "on_failure": {
        //           "messages": [
        //             {
        //               "say": "you have wrog input try again."
        //             }
        //           ],
        //           "repeat_question": true
        //         },
        //         "on_success": {
        //           "say": "Thank you for confirmation."
        //         },
        //         "max_attempts": {
        //           "redirect": "task://agent_transfer",
        //           "num_attempts": 3
        //         }
        //       }
        //     }
        //   ],
        //   "on_complete": {
        //     "redirect": "task://yes_no_task"
        //   }
        // };
        Remember.question = "check_name_task"
        if(Memory.check_name_task_cnt === undefined)
           Remember.check_name_task_cnt = 0;
        else 
        {
          
            Remember.check_name_task_cnt = parseInt(Memory.check_name_task_cnt) + 1;
            
        }



            
      //}
    
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };

   
    
 