const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.handler =async function(context, event, callback) {
    // let Say;
    // let Prompt;
    // let Listen = true;
    // let Collect = false;
     let Remember = {};
    // let Tasks = false;
    // let Redirect = false;
    // let Handoff = false;
  
    // Getting the real caller ID
    let validAnswer = false;
    // let userPhoneNumber = event.UserIdentifier;
    
    // console.log("ValidAccount");
     const Memory = JSON.parse(event.Memory);
    let AccountNo = event.ValidateFieldAnswer; //Memory.twilio.collected_data.collect_Accountnumber.answers.NumberOfacct.answer;
    console.log("AccountNo:" +AccountNo);
    Remember.user_phone_number = Memory.user_phone_number;
    Remember.clientData = Memory.clientData;
    
    
    if(AccountNo === undefined)
        Memory.AccountNo="14296104";
   
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
            userTotalBalance: +userRespData.TotalBalance
          };
  
          Remember.userData = userData;
        //   Say=false;
           validAnswer = true;
        //   Listen = false;
        //   Redirect = "task://Account_Status";

        } else {
            validAnswer = false;
        //   Say = `You have entered ${AccountNo} is not correct.`;
        //   Redirect = "task://getAccount";
        //   Collect = false;
        //   Listen = false;
          
        }
  
      } 
      else
      {
        validAnswer = false;
        // Say=`You dit't enter.`;
        //   Redirect = "task://getAccount";
  
        //   Listen = false;
      }
    let responseObject = {
        valid: validAnswer
    }
    
    //RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
    callback(null,responseObject)
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
  
      success = userRespData.Status === 'OK' ? true : false;
      
    } catch ( error ) {
      console.error( error.response );
      success = false;
    }
  
    return { success, userRespData };

  };