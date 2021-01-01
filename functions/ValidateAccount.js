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
    let AccStatus = false;
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
          AccStatus = userRespData.AccStatus;
          Remember.userData = userData;
        //   Say=false;
          console.log("AccStatus"+ AccStatus);
           Say = true;
           if( AccStatus ) 
           { 
              validAnswer = true;
           }
           else
           {
              validAnswer = false;
           }
         
        //   Listen = false;
        //   Redirect = "task://Account_Status";

        } else {
            validAnswer = false;
            AccStatus = false;
        //   Say = `You have entered ${AccountNo} is not correct.`;
        //   Redirect = "task://getAccount";
        //   Collect = false;
        //   Listen = false;
          
        }
  
      } 
      else
      {
        validAnswer = false;
        AccStatus = false;
        // Say=`You dit't enter.`;
        //   Redirect = "task://getAccount";
  
        //   Listen = false;
      }
      Remember.AccStatus = AccStatus;
      //if ( Remember ) {
        // responseObject.actions.push(
        //     {
        //         "remember" : Remember
        //     }
        // );
    //}
    // let responseObject = {
    //   "actions": [
                  
    //            ]
    //  };
    let responseObject = {
        valid: validAnswer,
        accountStatus: AccStatus,
        
    }
    
  //   if ( Redirect ) {
  //     responseObject.actions.push(
  //         {
  //             "redirect" : Redirect
  //         }
  //     );
  // }
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