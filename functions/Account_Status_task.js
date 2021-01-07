
exports.Account_Status_task =async function(context, event, callback,RB) {    
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = true;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);
    
    let sQues = `Your  account  is not active `;
    //Say = `${sQues}`;
    Listen = false;
    Redirect = true;
    Redirect = `task://agent_transfer`;
   
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };

   
    
 