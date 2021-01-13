exports.agent_transfer_task =async function(context, event, callback,RB) {
    try {
    let Listen = false;
    let Remember = {};
    let Collect = false;
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    let Say = "";
    
    //Say = `Please hold while we connect you with a account representative. This call maybe monitored and recorded , for quality assurance purposes.`;
        console.log("Agent transfer");
        Remember.Agent = true;
     RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
    
     } catch (error) {
    console.error(error);
    callback( error);
    }
    };