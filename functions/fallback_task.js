const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.fallback_task =async function(context, event, callback,RB) {
  try {
  let Listen = false;
  let Remember = {};
  let Collect = true;
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;
  let Say = "";
  
    Say="This is fallback taks";
   RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  
   } catch (error) {
  console.error(error);
  callback( error);
  }
  };