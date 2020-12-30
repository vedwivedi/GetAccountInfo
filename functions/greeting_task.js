const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.greeting_task =async function(context, event, callback,RB) {
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
    
    Remember.task_fail_counter = 0;
    Remember.repeat = false;
  
    if ( userPhoneNumber ) {
      userPhoneNumber = userPhoneNumber.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  
      const { success, clientRespData } = await TFN_Lookup(userPhoneNumber);
      console.log(clientRespData);
  
      if ( success ) {
        const clientData = {
          clientName: clientRespData.ClientName,
          mailingAddress: clientRespData.MailingAddress,
          webPaymentAddress: clientRespData.WebPaymentAddress,
          transferAgentNumber: clientRespData.TransferAgentNumber,
          namespace: clientRespData.NameSpace,
          channel: clientRespData.Channel,
          host: clientRespData.Host
        };
  
        Remember.user_phone_number = userPhoneNumber;
        Remember.clientData = clientData;
        Say = `Thank you for calling ${clientData.clientName}.`;

        Redirect = 'task://getAccount';

      } else {
        Say = `Thank you for calling. 
                There was a problem with the call. `;
  
        Listen = false;
  
        Remember.user_phone_number = userPhoneNumber;
  
        Redirect = 'task://agent_transfer';
      }

      RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  
  const TFN_Lookup = async ( phoneNumber ) => {
    let clientRespData;
    let success;
    
    try {
      const requestObj = {
        PhoneNumber: '8559092691',
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
  
   
    }
  };