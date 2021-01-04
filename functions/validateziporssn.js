
exports.handler =async function(context, event, callback) {
  console.log("validateziporssn:");
    let validAnswer = false;
  
      const Memory = JSON.parse(event.Memory);
  //    console.log("Memory:");
  //   let enterdigit = Memory.twilio.collected_data.collect_ziporssn.answers.answers;
  //   let AccStatus = false;
    let user_userssn = Memory.userData.userSsnLastFour;
     let user_Zip = Memory.userData.userZip;
     let enterdigit= event.ValidateFieldAnswer;
    
  console.log("enterdigit:"+ enterdigit);
  console.log("user_userssn:"+user_userssn);
  console.log("user_Zip:"+user_Zip);

    if ( enterdigit ) {

      if(user_userssn ===  enterdigit)
      {
        validAnswer = true;
      }
      else if(user_Zip === enterdigit)
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