const functions = Runtime.getFunctions();
const greetingTaskHandler = require(functions['greeting_task'].path);
const FallbackTaskHandler = require(functions['fallback_task'].path);
const responseBuilder = require(functions['response_builder'].path);
exports.handler = async (context, event, callback) => {
//testgitcode
//second
//gfgfgf
vccvvcvc
  const { CurrentTask } = event;
  console.log(CurrentTask);
  // calling task handlers
  switch (CurrentTask) {
    case 'greeting':
      await greetingTaskHandler.greeting_task(context, event, callback,responseBuilder.RB);
      break;

    case 'fallback':
      await FallbackTaskHandler.fallback_task(context, event, callback,responseBuilder.RB);
      break;

    default:
     await FallbackTaskHandler.fallback_task(context, event, callback,responseBuilder.RB);
      break;
  }
};