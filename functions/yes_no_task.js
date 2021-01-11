
exports.yes_no_task = async function(context, event, callback, RB)  {
    // console.log(event);
    
    try {
    let Say;
    let Prompt = '';
    let Tasks = false;
    let Remember = {};
    let Redirect = true;
    let Listen = false;
    let Collect = false;
    let Handoff = false;
  
    let Memory = JSON.parse(event.Memory);
    let userInput;
    if(event.CurrentInput === undefined)
    {
        userInput = "";
    }
    else
    {
        userInput = event.CurrentInput;
    }

    
       // const {​​ CurrentInput }​​ = event;
        
    console.log("userInput: " + userInput);
    //let name_check = Memory.userData.userName;
    Remember.task_fail_counter = 0;
    Remember.repeat = false;
    let YesNo ="";
    if(userInput != "")
    {
      YesNo = CheckYesNoInput(userInput);
    }

    console.log(event.Field_yes_no_Value);
    console.log("YesNo: " +YesNo);
  
    switch ( Memory.question ) {
      case 'check_name_task':
        if (event.Field_yes_no_Value === 'Yes' || YesNo === 'Yes') {
          Remember.check_name_task_yesno = "Yes";
          Redirect = "task://ZipOrSSN_Taks";
        } else if (event.Field_yes_no_Value === 'No' || YesNo === 'No') {
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
  } catch (error) {
    console.error(error);
    callback( error);
    }
    };

    function CheckYesNoInput(x) { 
      let sYesNo='';
          
      if(x.includes('correct')) sYesNo='Yes';
      if(x.includes('It is correct')) sYesNo='Yes';
      if(x.includes('my')) sYesNo='Yes';
      if(x.includes('may')) sYesNo='Yes';
      if(x.includes('its my')) sYesNo='Yes';
      if(x.includes('right')) sYesNo='Yes';
      if(x.includes('okay')) sYesNo='Yes';
      if(x.includes('OK')) sYesNo='Yes';
      if(x.includes('agree')) sYesNo='Yes';
      if(x.includes('yup')) sYesNo='Yes';
      if(x.includes('okay')) sYesNo='Yes';
      if(x.includes('It is true')) sYesNo='Yes';
  
      if(x.includes('not')) sYesNo='No';
      if(x.includes('wrong')) sYesNo='No';
      if(x.includes('not correct')) sYesNo='Yes';
      if(x.includes('It is not correct')) sYesNo='Yes';
      if(x.includes('It is wrong')) sYesNo='No';
      if(x.includes('noway')) sYesNo='No';
      if(x.includes('nah')) sYesNo='No';
      if(x.includes('negative')) sYesNo='No';
      if(x.includes('it is not true')) sYesNo='No';
      
      //else if(x.includes('it is')) sYesNo='Yes';
  
  console.log("sYesNo: "+ sYesNo);
      
      return sYesNo;
  }

  
  