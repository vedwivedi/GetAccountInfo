
exports.handler =async function(context, event, callback) {
  
    let validAnswer = false;
  
     const Memory = JSON.parse(event.Memory);
    let enterdigit = Memory.twilio.collect_ziporssn.answers.answers;
    let AccStatus = false;
    let user_userssn = Memory.userData.userSsnLastFour;
    let user_Zip = Memory.userData.userZip;
    let va= event.ValidateFieldAnswer;
    console.log("vvalue:"+ va);
  console.log("enterdigit:"+enterdigit);
  console.log("user_userssn:"+user_userssn);
  console.log("user_Zip:"+user_Zip);

    if ( enterdigit ) {

      if( user_userssn )
      {
        validAnswer = true;
      }
      else if( user_Zip )
      {
        validAnswer = true;
      }
      else
      {
        validAnswer = false;
      }
    }
    else
    {
      validAnswer = false;
    }

    let responseObject = {
      valid: validAnswer
  }    
       
    callback(null,responseObject)
  };