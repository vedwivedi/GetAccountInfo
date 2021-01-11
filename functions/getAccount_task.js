const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@peco.convergentusa.com/Convergent_Main_IVR/Home';

exports.getAccount_task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
  
    const Memory = JSON.parse(event.Memory);

    Remember.clientData = Memory.clientData;
    Remember.CurrentTask = "getAccount_task";

    // Getting the real caller ID
    let sMsg = "";
    if(Memory.clientData.channel == 'SMS')
        sMsg = "in the body of the SMS you received";
    else if(Memory.clientData.channel == 'SendGrid Email')
        sMsg = "in the upper right hand corner of the Email you received";
    else    
        sMsg = "in the upper right hand corner of the letter you received";     

   let squestion = `Please Say or enter your account number starting with ${Remember.clientData.F_Letter_Namespace}, located ${sMsg}. Enter the number digits after the letter ${Remember.clientData.F_Letter_Namespace}.`; 
   
   let bPhone = false;
   
   if(Memory.AccountFrom == "Phone")
   {
      squestion = `We could not find your account number from the phone you are calling. Please Say or enter your account number , located ${sMsg}.`; 
      bPhone = true;
   }
  

  let Collect_Json =  {
      "name": "collect_Accountnumber",
      "questions": [
              {
              "question": `${squestion}`,
              "prefill": "NumberOfacct",
              "name": "NumberOfacct",
              "type": "Twilio.NUMBER_SEQUENCE",
              "voice_digits": {
                "num_digits": 20,
                "finish_on_key": "#"
                
              },
              }

            ],
      "on_complete": {
      "redirect": 	 "task://getAccount"
              }
    }

    // console.log(userPhoneNumber);
    
    let userPhoneNumber = Memory.user_phone_number;
    let AccountNo = false;
    Remember.user_phone_number = Memory.user_phone_number;
   
    //Remember.AccountFrom = "-1";
    if(Memory.AccountFrom == "Phone")
    {
      AccountNo = userPhoneNumber;
      Remember.AccountFrom = "";
      
    }
    else
    {
      try{
        AccountNo = Memory.twilio.collected_data.collect_Accountnumber.answers.NumberOfacct.answer;
      
      }
      catch
      {
        AccountNo = null
      }
      
    }
    
    console.log("MemorygetAccount_task_counter; " +Memory.AccountFailed_Counter);
    let YesNo= null;
    //  if(Memory.AccountFailed_Counter >=2)
    //  {
    //   Say = `We need to transfer you to an agent for account number, <say-as interpret-as='digits'>${AccountNo}</say-as> you entered is not correct.`;
    //   Collect = false;
    //   Redirect = true;
    //   Redirect = "task://agent_transfer";
    //   RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
    //   return;
    //  }
    
    if(Memory.check_name_task_yesno  != undefined)
    {
      YesNo = Memory.check_name_task_yesno;
    }
    
    if(YesNo == 'No')
    {
      Remember.check_name_task_yesno = "";
      Memory.twilio = {};
      event.Memory.twilio = {};
      AccountNo = null;
    }

    
    
    console.log("AccountNo:" +AccountNo);
   
    if ( AccountNo ) {
      console.log("ifAccountNo:"+ AccountNo);
        const reqData = {
          accountNumber: AccountNo,
          namespace: Remember.clientData.namespace,
          host: Remember.clientData.host,
          callerPhoneNumber: Remember.user_phone_number
        };
        
        const { success, userRespData } = await GetInboundAccountInfo(reqData);
  
        if ( success ) {
          console.log("successAccountNo:"+ AccountNo);
          const userData = {
            userName: userRespData.FullName,
            userZip: userRespData.ZipCd,
            userSsnLastFour: userRespData.SSNLastFour,
            accountNumber: userRespData.SeedAcct,
            accountStatus: userRespData.AccStatus === '1' ? true : false,
            userTotalBalance: +userRespData.TotalBalance,
            RouteBalance: userRespData.RouteBalance,	
            AutomatedCCFlag: userRespData.AutomatedCCFlag,	
            AutomatedCCFee: userRespData.AutomatedCCFee,	
            AutomatedACHFlag: userRespData.AutomatedACHFlag,	
            AutomatedACHFee: userRespData.AutomatedACHFee,	
            ClientClass: userRespData.ClientClass,	
            ClientAcct: userRespData.ClientAcct,	
            ClientID: userRespData.ClientID,		
            PhoneNum: userRespData.PhoneNum,	
            Disposition: userRespData.Disposition,	
            LastPayDate: userRespData.LastPayDate,	
            LastPayAmnt: userRespData.LastPayAmnt,	
            SeedAcct: userRespData.SeedAcct,	
            ADD1: userRespData.ADD1,	
            ADD2: userRespData.ADD2,	
            CITY: userRespData.CITY,	
            STATE: userRespData.STATE	

          };
          Remember.userData = userData;
          Remember.AccountFrom = 'Manual';
          Say=false;
          Listen = false;
          Redirect = true;
          Remember.AccountFailed_Counter = 0;
          if( userData.accountStatus )
              Redirect = "task://check_name_task";
          else
          {
            Collect = false;
            Redirect = true;
            Say = `We need to transfer you to an agent for account number, <say-as interpret-as='digits'>${AccountNo}</say-as> is not active.`;
            Redirect = "task://agent_transfer";
          }
        }
        else
        {
          if(Memory.AccountFailed_Counter >=2)
          {
            //Say = `We need to transfer you to an agent for account number, <say-as interpret-as='digits'>${AccountNo}</say-as> you entered is not correct.`;
            Collect = false;
            Redirect = true;
            Redirect = "task://agent_transfer";
            RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
            return;
          }

          if(Memory.AccountFailed_Counter === undefined)
              Remember.AccountFailed_Counter = 0;
          else 
          {
          
            Remember.AccountFailed_Counter = parseInt(Memory.AccountFailed_Counter) + 1;
            
          }

          if( !bPhone )
              Say = `The account number, <say-as interpret-as='digits'>${AccountNo}</say-as> you entered is not correct.`;


          Collect  = true;
          Remember.question ="getAccount_task";
          Collect = Collect_Json;

        }
          
     }
      else
      {
        if(Memory.AccountFailed_Counter >=2)
        {
          //Say = `We need to transfer you to an agent for account number, <say-as interpret-as='digits'>${AccountNo}</say-as> you entered is not correct.`;
          Collect = false;
          Redirect = true;
          Redirect = "task://agent_transfer";
          RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
          return;
        }
        if(Memory.AccountFailed_Counter === undefined)
            Remember.AccountFailed_Counter = 0;
        else 
        {
         
         Remember.AccountFailed_Counter = parseInt(Memory.AccountFailed_Counter) + 1;
         
        }
          Collect  = true;
          Remember.question ="getAccount_task";
          Collect = Collect_Json;

        
      }
    
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
   
  const GetInboundAccountInfo = async ( reqData ) => {
    let userRespData;
    let success;
    
    try {
      const requestObj = {
        'AccountNo': reqData.accountNumber,  // A/C number the caller entered. Or the caller’s phone number
        'NameSpace':reqData.namespace,  // coming from the result of TFN_LookUp
        'AccountType': 'F', // hard coded
        'NameType': 'P',  // hard coded
        'SeedFlag': '1',  // hard coded
        'Host': reqData.host, // coming from the result of TFN_LookUp
        'PhoneNumber': reqData.callerPhoneNumber, // caller’s phone number
        'PhoneNumberTo': '+19993602702146', // the phone number they are calling to
        'IVRUsed':'MainIVR'
      };
  
      const responseObj = await axios.post(`${API_ENDPOINT}/GetInboundAccountInfo`, requestObj);
      userRespData = responseObj.data;
  
      success = userRespData.Returns === '1' ? true : false;
      
    } catch ( error ) {
      console.error( error.response );
      success = false;
    }
  
    return { success, userRespData };

  };