const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.greeting_task =async function(context, event, callback,RB) {
  try {
  let Listen = false;
  let Remember = {};
  let Collect = false;
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;
  let Say = "";
  // Add your code here.  
    
    Say="This is Gretting taks test";
  //End of your code.
  
  RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  
   } catch (error) {
  console.error(error);
  callback( error);
  }
  };