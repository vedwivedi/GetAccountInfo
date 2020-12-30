const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.getAccount_task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = true;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
  
    // Getting the real caller ID
    let userPhoneNumber = event.UserIdentifier;
    // console.log(userPhoneNumber);
    const Memory = JSON.parse(event.Memory);
    if(Memory.AccountNo === undefined)
        Memory.AccountNo="14296104";
    Remember=JSON.parse(event.Remember);
    Remember.task_fail_counter = 0;
    Remember.repeat = false;
    console.log("fn getAccount task:");
    if ( Memory.AccountNo ) {
      
        const reqData = {
          accountNumber: Memory.AccountNo,
          namespace: Remember.clientData.namespace,
          host: Remember.clientData.host,
          callerPhoneNumber: Remember.user_phone_number
        };
        
        const { success, userRespData } = await GetInboundAccountInfo(reqData);
  
        if ( success ) {
          const userData = {
            userName: userRespData.FullName,
            userZip: userRespData.ZipCd,
            userSsnLastFour: userRespData.SSNLastFour,
            accountNumber: userRespData.SeedAcct,
            accountStatus: userRespData.AccStatus === '1' ? true : false,
            userTotalBalance: +userRespData.TotalBalance
          };
  
          Remember.userData = userData;
          Say=false;
          Listen = false;
          Redirect = "task://Account_Status";

        } else {
          Say=`You have entered ${Memory.AccountNo} is not correct.`;
          Redirect = "task://getAccount";
  
          Listen = false;
        }
  
      } 
      else
      {
        Say=`You dit't enter.`;
          Redirect = "task://getAccount";
  
          Listen = false;
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
  
      success = userRespData.Status === 'OK' ? true : false;
      
    } catch ( error ) {
      console.error( error.response );
      success = false;
    }
  
    return { success, userRespData };

  };