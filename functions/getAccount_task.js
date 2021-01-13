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

    if(Memory.AccountFailed_Counter === undefined){
      Remember.AccountFailed_Counter = 0;
    }
    else {
      Remember.AccountFailed_Counter = parseInt(Memory.AccountFailed_Counter) + 1;
    }

    // Getting the real caller ID
    let sMsg = "";
    if(Memory.clientData.channel == 'SMS')
        sMsg = "in the body of the SMS you received";
    else if(Memory.clientData.channel == 'SendGrid Email')
        sMsg = "in the upper right hand corner of the Email you received";
    else    
        sMsg = "in the upper right hand corner of the letter you received";     

   let squestion = `Please Say or enter your account number starting with ${Remember.clientData.F_Letter_Namespace}, located ${sMsg}. Enter the number digits after the letter ${Remember.clientData.F_Letter_Namespace}.`; 
   
   if(Memory.AccountFailed_Counter != undefined)
      {
        console.log("MemorygetAccount_task_counter; " +Memory.AccountFailed_Counter);
        if(Memory.AccountFailed_Counter == 1)
        {
          squestion = "I did not understand. , " +squestion;
        }
      }
   

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
              // "prefill": "NumberOfacct",
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
    let AccountNo = null;
    Remember.user_phone_number = Memory.user_phone_number;
   
    

    //Remember.AccountFrom = "-1";
    if(Memory.AccountFrom == "Phone")
    {
      AccountNo = userPhoneNumber;
      Remember.AccountFrom = "";
      
    }
    else
    {
      if(Memory.Fallback_getAccount_task == true)
      {
        AccountNo = null;
        Remember.Fallback_getAccount_task = false;
        console.log("Fallback_getAccount_task : "+  Memory.Fallback_getAccount_task);
        
      }
      else{
          try{
            console.log("collected_dataACCT : "+ Memory.twilio.collected_data.collect_Accountnumber.answers.NumberOfacct.answer);
              AccountNo = Memory.twilio.collected_data.collect_Accountnumber.answers.NumberOfacct.answer;
      
            }
          catch
          {
            console.log("Catch collected_dataACCT : ");
            AccountNo = null;
          }   
      }
    }
    
   
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
          callerPhoneNumber: Remember.user_phone_number,
          TFN: Memory.TFN
        };
        
        const { success, userRespData } = await GetInboundAccountInfo(reqData);
  
        if ( success ) {
          console.log("userRespData:"+ JSON.stringify(userRespData));
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
          console.log("userData:"+ JSON.stringify(userData));
          Remember.userData = userData;
          Remember.userName = userRespData.FullName,
            Remember. userRespData.ZipCd,
            Remember.userSsnLastFour = userRespData.SSNLastFour;
            Remember.accountNumber =  userRespData.SeedAcct;
            Remember.accountStatus =  userRespData.AccStatus === '1' ? true : false;
            Remember.userTotalBalance =  userRespData.TotalBalance;
            Remember.RouteBalance =  userRespData.RouteBalance;
            Remember.AutomatedCCFlag =  userRespData.AutomatedCCFlag;	
            Remember.AutomatedCCFee =  userRespData.AutomatedCCFee;
            Remember.AutomatedACHFlag =  userRespData.AutomatedACHFlag;
            Remember.AutomatedACHFee =  userRespData.AutomatedACHFee;	
            Remember.ClientClass =  userRespData.ClientClass;
            Remember.ClientAcct =  userRespData.ClientAcct;
            Remember.ClientID =  userRespData.ClientID;		
            Remember.PhoneNum =  userRespData.PhoneNum;	
            Remember.Disposition =  userRespData.Dispositio;	
            Remember.LastPayDate =  userRespData.LastPayDate;	
            Remember.LastPayAmnt =  userRespData.LastPayAmnt;	
            Remember.SeedAcct =  userRespData.SeedAcct;	
            Remember.ADD1 =  userRespData.ADD1;	
            Remember.ADD2 =  userRespData.ADD2;	
            Remember.CITY =  userRespData.CITY;	
            Remember.STATE =  userRespData.STATE;	
          
          Say = false;
          Listen = false;
          Redirect = true;
          Remember.AccountFailed_Counter = 0;
          if( userData.accountStatus )
          {
            console.log("accountStatus true:");
              Redirect = "task://check_name_task";
          }
          else
          {
            console.log("accountStatus false:");
            Collect = false;
            Redirect = true;
            Say = `We need to transfer you to an agent for account number, <say-as interpret-as='digits'>${AccountNo}</say-as> is not active.`;
            Redirect = "task://agent_transfer";
          }
        }
        else
        {
          console.log("is account is wrong : "+Memory.AccountFailed_Counter);
          if(Memory.AccountFailed_Counter >=2)
          {
            console.log("AccountFailed_Counter wrong input");
            Say = false;
            Listen = false;
            Collect = false;
            Redirect = true;
            Redirect = "task://agent_transfer";
            RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
            return;
          }

          
          Remember.AccountFrom = "Manual";

          if( !bPhone )
              Say = `The account number, <say-as interpret-as='digits'>${AccountNo}</say-as> you entered is not correct.`;


          Collect  = true;
          Remember.question ="getAccount_task";
          Collect = Collect_Json;

        }
          
     }
    else{
        console.log("is account is null : "+Memory.AccountFailed_Counter);
        // if(Memory.AccountFailed_Counter >=2)
        // {
        //   console.log("AccountFailed_Counter where account is null");
        //     Say = false;
        //     Listen = false;
        //     Collect = false;
        //     Redirect = true;
        //     Redirect = "task://agent_transfer";
        //     RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
        //     return;
        // }
        // else
        // {
        
          Collect  = true;
          Remember.question ="getAccount_task";
          Collect = Collect_Json;
        //}

        
      }

      console.log("Say: "+Say +"Listen: "+ Listen +"Remember: "+ Remember+ "Collect: "+Collect+"Tasks: " +Tasks+ "Redirect: "+Redirect+ "Handoff: "+ Handoff);
    
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
        'PhoneNumberTo': reqData.TFN, // the phone number they are calling to
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