// yes_no handler function
//exports.greeting_task =async function(context, event, callback,RB) {
exports.yes_no_task = async function(context, event, callback, RB)  {
    // console.log(event);
    let Say;
    let Prompt = '';
    let Tasks = false;
    let Remember = {};
    let Redirect = true;
    let Listen = false;
    let Collect = false;
    let Handoff = false;
  
    const Memory = JSON.parse(event.Memory);
    
    //let name_check = Memory.userData.userName;
    Remember.task_fail_counter = 0;
    Remember.repeat = false;
  
    console.log(event.Field_yes_no_Value);
  
    switch ( Memory.question ) {
      case 'check_name_task':
        if (event.Field_yes_no_Value === 'Yes') {

            Redirect = "task://ZipOrSSN_Taks";
        //   Collect = {
        //     "name": "collect_digits",
        //     "questions": [
        //       {
        //         "question": `For your account verification say 5 digits of your Zip code or last 4 digits of your Social Security number.`,
        //         "voice_digits": {
        //           "finish_on_key": "#"
        //         },
        //         "name": "digits",
        //         "type": "Twilio.NUMBER_SEQUENCE"
        //       }
        //     ],
        //     "on_complete": {
        //       "redirect": "task://setMM"
        //     }
        //   };
          Say = false;
          Listen = false;
  
          // Say = 'For your account verification say 5 digits of your Zip code or last 4 digits of your Social Security number.';
         // Remember.digits_request_task = 'zip_ssn';
  
          break;
  
        } else if (event.Field_yes_no_Value === 'No') {
        
         Redirect = "task://getAccount";
          Say = false;
          Listen = false;
  
          break;
  
        } else {
          Say = false;
          Redirect = 'task://fallback';
  
          break;
        }
  
      default:
        Say = false;
        Redirect = 'task://fallback';
  
        break;
    }
  
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
  
  