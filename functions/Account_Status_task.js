const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.Account_Status_task =async function(context, event, callback,RB) {
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
    let accountStatus = Memory.userData.AccStatus;

    if( accountStatus == false)
    {
        if(Memory.AccountFrom == "Phone")
        {
            sQues = `This phone number  ${Accountnumber} is not active.`;
        }
        else
        {
       sQues = `This account number , ${Accountnumber} is not active `;
        }

        Say = `${sQues}`;
        Redirect = true;
        Redirect = "task://agent_transfer";
    }
    else
    {
        Redirect = true;
        Redirect = "task://check_name_task";

    }
        

    
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };

   
    
 