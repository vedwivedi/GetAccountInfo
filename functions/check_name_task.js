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
    Remember.CurrentTask = "check_name_task";
    let name_check = Memory.userData.userName;
    let sQues = "";
    let Accountnumber = Memory.userData.accountNumber;

    if(Memory.AccountFrom == "Phone")
      sQues = `if your name is, ${name_check}  and  your account number is ${Accountnumber},,Please Press  1 or Say Yes to confirm your name, , press 2 or Say No,, if that is not your name  `;
    else
       sQues = `if your name is, ${name_check} ,,Please Press  1 or Say Yes to confirm your name, , press 2 or Say No,, if that is not your name `;

    Say = `${sQues}`;
    Listen = true;
    Remember.question = "check_name_task"
    Tasks = ['yes_no', 'agent_transfer'];
  
    if(Memory.check_name_task_cnt === undefined)
      Remember.check_name_task_cnt = 1;
    else 
      Remember.check_name_task_cnt = parseInt(Memory.check_name_task_cnt) + 1;
            
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };

   
    
 