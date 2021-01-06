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
  
    let Memory = JSON.parse(event.Memory);
    
    //let name_check = Memory.userData.userName;
    Remember.task_fail_counter = 0;
    Remember.repeat = false;
  
    console.log(event.Field_yes_no_Value);
  
    switch ( Memory.question ) {
      case 'check_name_task':
        if (event.Field_yes_no_Value === 'Yes') {
          Remember.check_name_task_yesno = "Yes";
          Redirect = "task://ZipOrSSN_Taks";
        } else if (event.Field_yes_no_Value === 'No') {
          Remember.check_name_task_yesno = "No";

          console.log(JSON.stringify(event.Memory));
         Redirect = "task://getAccount";
        } else {
          Remember.check_name_task_yesno = "";
          Redirect = 'task://fallback';
        }
        break;
  
      default:
        
        Redirect = 'task://fallback';
  
        break;
    }
  
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
  
  