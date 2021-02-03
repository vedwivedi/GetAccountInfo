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

    Remember.clientName = "";
    Remember.mailingAddress = "";
    Remember.OnlinePaymentURL = "";
    Remember.transferAgentNumber = "";
    Remember.namespace = "";
    Remember.channel = "";
    Remember.host = "";
    Remember.TFN = "";
    Remember.F_Letter_Namespace = "";
    Remember.AccountFrom = "";

    Remember.FullName = "";
    Remember.ZipCd = "";
    Remember.SSNLastFour = "";
    Remember.accountNumber =  "";
    Remember.accountStatus =  "";
    Remember.TotalBalance =  "";
    Remember.RouteBalance =  "";
    Remember.AutomatedCCFlag =  "";	
    Remember.AutomatedCCFee =  "";
    Remember.AutomatedACHFlag =  "";
    Remember.AutomatedACHFee =  "";	
    Remember.ClientClass =  "";
    Remember.ClientAcct =  "";
    Remember.ClientID =  "";		
    Remember.PhoneNum =  "";	
    Remember.Disposition =  "";	
    Remember.LastPayDate =  "";	
    Remember.LastPayAmnt =  "";	
    Remember.SeedAcct =  "";	
    Remember.ADD1 =  "";	
    Remember.ADD2 =  "";	
    Remember.CITY =  "";	
    Remember.STATE =  "";	
    Remember.Status =  "";

    let userPhoneNumber;
    let TFN;
    try{
      userPhoneNumber = Memory.twilio.voice.From;
    }
    catch{
        userPhoneNumber = "+13109025157";
    }

    try{
       TFN = Memory.twilio.voice.To;
    }
    catch{
       TFN = "8777215502";
    }

    Remember.Agent = false;
    console.log("userPhoneNumber :" +userPhoneNumber);
    Remember.CurrentTask = "greeting";
    //let userPhoneNumber = event.UserIdentifier;
    Remember.AccountFrom = "-1";
    
    
    let bTFn_success = false;
    if(TFN === undefined){
      bTFn_success = false;
      Say = `Thank you for calling. There was a problem with the call. `;
      Listen = false;
      Collect = false;
      Redirect = true;
      Redirect = `task://agent_transfer` ;
    }
    else{
     // TFN = "8777215502"; // when go production comment this line
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
          Remember.user_phone_number = clientRespData.PhoneNumberTo;
          Remember.clientData = clientData;

          Remember.clientName = clientRespData.ClientName;
          Remember.mailingAddress = clientRespData.MailingAddress;
          Remember.OnlinePaymentURL = clientRespData.WebPaymentAddress;
          Remember.transferAgentNumber = clientRespData.TransferAgentNumber;
          Remember.namespace = clientRespData.NameSpace;
          Remember.channel = clientRespData.Channel;
          Remember.host = clientRespData.Host;
          Remember.TFN = clientRespData.PhoneNumber;
          Remember.F_Letter_Namespace = (clientRespData.NameSpace.charAt(0));

          Remember.AccountFrom = "Phone";
          Redirect = true;
        //Redirect = "task://getAccount";
        if( bTFn_success == true  && userPhoneNumber != null){
        const reqData = {
          accountNumber: userPhoneNumber,
          namespace: Remember.clientData.namespace,
          host: Remember.clientData.host,
          callerPhoneNumber: Remember.user_phone_number,
          TFN: TFN
        };
        console.log("Remember.user_phone_number : "+Remember.user_phone_number);
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
            TotalBalance: userRespData.TotalBalance,
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
            ADD1: userRespData.Address1,	
            ADD2: userRespData.Address2,	
            CITY: userRespData.City,	
            STATE: userRespData.State,
            Status: userRespData.Status

          };
            console.log("userData:"+ JSON.stringify(userData));
            Remember.userData = userData;

            Remember.FullName = userRespData.FullName;
            Remember.ZipCd = userRespData.ZipCd;
            Remember.SSNLastFour = userRespData.SSNLastFour;
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
            Remember.Disposition =  userRespData.Disposition;	
            Remember.LastPayDate =  userRespData.LastPayDate;	
            Remember.LastPayAmnt =  userRespData.LastPayAmnt;	
            Remember.SeedAcct =  userRespData.SeedAcct;	
            Remember.ADD1 =  userRespData.Address1;	
            Remember.ADD2 =  userRespData.Address2;	
            Remember.CITY =  userRespData.City;	
            Remember.STATE =  userRespData.State;	
            Remember.Status =  userRespData.Status.toString();	

          if( userData.accountStatus ){
            console.log("accountStatus true:");
            Redirect = "task://check_name_task";
          }
          else{
            console.log("accountStatus false:");
            Redirect = "task://getAccount";
          }
        }
        else{
          console.log("phone number :"+Remember.user_phone_number + " Status : "+ userRespData.Status.toString());
          Remember.Status_PhoneNotFound =  userRespData.Status.toString();	
          Redirect = "task://getAccount";
        }
      }
      else{
        console.log("phone number not found record :");
        Redirect = "task://getAccount";
      }
        
    }
      else{
        Say = `Thank you for calling. There was a problem with the call. `;
        Listen = false;
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
      success = clientRespData.Returns === '1' ? true : false;
      
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
        'AccountType': 'P', // hard coded  for phone number as accpunaccount number
        'NameType': 'P',  // hard coded
        'SeedFlag': '1',  // hard coded
        'Host': reqData.host, // coming from the result of TFN_LookUp
        'PhoneNumber': reqData.callerPhoneNumber, // caller’s phone number
        'PhoneNumberTo': reqData.TFN, // the phone number they are calling to
        'IVRUsed':'MainAutoIVR10'
      };
      console.log("requestObj: "+JSON.stringify(requestObj));
  
      const responseObj = await axios.post(`${API_ENDPOINT}/GetInboundAccountInfoAuto`, requestObj);
      userRespData = responseObj.data;
  
      success = userRespData.Returns === '1' ? true : false;
      
    } catch ( error ) {
      console.error( error.response );
      success = false;
    }
  
    return { success, userRespData };

  };
   
    
 