const functions = Runtime.getFunctions();
const greetingTaskHandler = require(functions['greeting_task'].path);
const getAccountTaskHandler = require(functions['getAccount_task'].path);
const FallbackTaskHandler = require(functions['fallback_task'].path);
const responseBuilder = require(functions['response_builder'].path);
const check_name_TaskHandler = require(functions['check_name_task'].path);
const ZipOrSSN_TaksHandler = require(functions['ZipOrSSN_Taks'].path);  
const NameNotMatchTaksHandler = require(functions['NameNotMatch'].path); 
const yes_noTaksHandler = require(functions['yes_no_task'].path); 
const agent_transfer_TaskHandler = require(functions['agent_transfer_task'].path); 

exports.handler = async (context, event, callback) => {

  const { CurrentTask } = event;
  const { CurrentTaskConfidence } = event;
  console.log("CurrentTask : "+ CurrentTask +" ,Confidence: " + CurrentTaskConfidence + '\n');
  // calling task handlers
  switch (CurrentTask) {
    case 'greeting':
      await greetingTaskHandler.greeting_task(context, event, callback,responseBuilder.RB);
      break;

    case 'getAccount':
        await getAccountTaskHandler.getAccount_task(context, event, callback,responseBuilder.RB);
        break;
    case 'check_name_task':
          console.log("check_name_task:");
            await check_name_TaskHandler.check_name_task(context, event, callback,responseBuilder.RB);
            break;
    case 'ZipOrSSN_Taks':
          console.log("ZipOrSSN_Taks:");
            await ZipOrSSN_TaksHandler.ZipOrSSN_Task(context, event, callback,responseBuilder.RB);
            break;
    case 'NameNotMatch':
          console.log("NameNotMatch:");
            await NameNotMatchTaksHandler.NameNotMatch(context, event, callback,responseBuilder.RB);
            break;

    case 'yes_no':
          console.log("yes_no:");
            await yes_noTaksHandler.yes_no_task(context, event, callback,responseBuilder.RB);
            break;
    case 'agent_transfer':
      await agent_transfer_TaskHandler.agent_transfer_task(context, event, callback,responseBuilder.RB);
      break;

    case 'fallback':
      await FallbackTaskHandler.fallback_task(context, event, callback,responseBuilder.RB);
      break;

    default:
     await FallbackTaskHandler.fallback_task(context, event, callback,responseBuilder.RB);
      break;
  }
};