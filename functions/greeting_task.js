const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@peco.convergentusa.com/Convergent_Main_IVR/Home';

exports.greeting_task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);

    
    let userPhoneNumber = Memory.twilio.voice.From; //"+13109025157";
    let TFN = "8559092691"; //Memory.twilio.voice.To;
    console.log("userPhoneNumber :" +userPhoneNumber);
    //Remember.fallback = "";
    Remember.CurrentTask = "greeting";
    //let userPhoneNumber = event.UserIdentifier;
    Remember.AccountFrom = "-1";
    
    
    let bTFn_success = false;
    if(TFN === undefined)
    {
      bTFn_success = false;
        //go to agent 
        //return
    }
    else
    {
     
         //userPhoneNumber = "+14151234567";
        //userPhoneNumber = "+17044880416";
      Remember.TFN = TFN;
      Remember.user_phone_number = userPhoneNumber;
      userPhoneNumber = userPhoneNumber.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      const { success, clientRespData } = await TFN_Lookup(userPhoneNumber,TFN);
      console.log(clientRespData);
  
      if ( success ) {
        bTFn_success = true;
        const clientData = {
          clientName: clientRespData.ClientName,
          mailingAddress: clientRespData.MailingAddress,
          webPaymentAddress: clientRespData.WebPaymentAddress,
          transferAgentNumber: clientRespData.TransferAgentNumber,
          namespace: clientRespData.NameSpace,
          channel: clientRespData.Channel,
          host: clientRespData.Host,
          TFN: clientRespData.PhoneNumber,
          user_phone_number: clientRespData.PhoneNumberTo,
          F_Letter_Namespace: (clientRespData.NameSpace.charAt(0))
          //F_Letter_Namespace:  clientRespData.NameSpace.substring((clientRespData.NameSpace.length -1),clientRespData.NameSpace.length)
        };
        Say = true;
        Listen = false;
        Say = `Thank you for calling. ${clientRespData.ClientName} `;
        Remember.user_phone_number=clientRespData.PhoneNumberTo;
        Remember.clientData = clientData;
        Remember.AccountFrom = "Phone";
        Redirect = true;
        //Redirect = "task://getAccount";
      if( bTFn_success == true  && userPhoneNumber != null)
      {
        const reqData = {
          accountNumber: userPhoneNumber,
          namespace: Remember.clientData.namespace,
          host: Remember.clientData.host,
          callerPhoneNumber: Remember.user_phone_number,
          TFN: TFN
        };
        
        console.log("RequestData:"+ JSON.stringify(reqData));
        const { success, userRespData } = await GetInboundAccountInfoWithPhone(reqData);
        console.log("Accountsuccess:"+ success);
        if ( success ) {
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

          if( userData.accountStatus )
          {
            console.log("accountStatus true:");
            Redirect = "task://check_name_task";
          }
          else
          {
            console.log("accountStatus false:");
            Redirect = "task://getAccount";
          }
        }
        else
        {
          console.log("phone number not found record :");
          Redirect = "task://getAccount";
        }
      }
      else
      {
        console.log("phone number not found record :");
        Redirect = "task://getAccount";
      }
        
    }
      else
      {
        Say = `Thank you for calling. There was a problem with the call. `;
        Listen = true;
        Collect = false;
        Redirect = true;
        Redirect = `task://agent_transfer` ;
      }
    }

  
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };



  const TFN_Lookup = async ( phoneNumber,TFN ) => {
    let clientRespData;
    let success;
    
    try {
      const requestObj = {
        PhoneNumber: TFN,
        PhoneNumberTo: phoneNumber
      };
  
      const responseObj = await axios.post(`${API_ENDPOINT}/TFN_LookUp`, requestObj);
      clientRespData = responseObj.data;
      success = clientRespData.status === 'ok' ? true : false;
      
    } catch ( error ) {
      console.error( error.response );
      success = false;
    }
  
    return { success, clientRespData };
  };

 
  const GetInboundAccountInfoWithPhone = async ( reqData ) => {
    let userRespData;
    let success;
    
    try {
      const requestObj = {
        'AccountNo': reqData.callerPhoneNumber,  // A/C number the caller entered. Or the caller’s phone number
        'NameSpace':reqData.namespace,  // coming from the result of TFN_LookUp
        'AccountType': 'P', // hard coded 
        'NameType': 'P',  // hard coded
        'SeedFlag': '1',  // hard coded
        'Host': reqData.host, // coming from the result of TFN_LookUp
        'PhoneNumber': reqData.TFN, // caller’s phone number
        'PhoneNumberTo': reqData.callerPhoneNumber, // the phone number they are calling to
        'IVRUsed':'MainIVR'
      };
      console.log("requestObj: "+JSON.stringify(requestObj));
  
      const responseObj = await axios.post(`${API_ENDPOINT}/GetInboundAccountInfo`, requestObj);
      userRespData = responseObj.data;
  
      success = userRespData.Returns === '1' ? true : false;
      
    } catch ( error ) {
      console.error( error.response );
      success = false;
    }
  
    return { success, userRespData };

  };
   
    
 