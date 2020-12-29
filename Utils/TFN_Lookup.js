const eventHandler = require('../functions/TFN_Lookup.js');
const responseBuilder = require('./response_builder.js');

  const context = {};
  const event = {
    AccountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
    AssistantSid: 'UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
    DialogueSid: 'UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
    date_created: '',
    UserIdentifier: '+14151234567',
    CurrentInput: 'how many colors are in the rainbow',
    CurrentTask: 'fallback',
    DialoguePayloadUrl:
      'https://autopilot.twilio.com/v1/Assistants/UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1/Dialogues/UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
    Memory: `{
      "task_fail_counter": 0,
      "user_phone_number": "+14151234567",
      "clientData": {
        "transferAgentNumber": "+18334050479",
        "clientName": "Convergent Outsourcing",
        "mailingAddress": " Convergent Outsourcing Incorporated ,   P O Box 9 0 0 4  ,   Renton  ,   Washington ,   9 8 0 5 7",
        "webPaymentAddress": "payconvergent.com",
        "namespace": "RED",
        "channel": "SendGrid Email",
        "host": "FACS"
      },
      "twilio": {
        "collected_data": {
          "collect_phone_num": {
            "status": "complete",
            "date_started": "2020-12-11T09:57:58Z",
            "date_completed": "2020-12-11T09:58:01Z",
            "answers": {
              "phone_num": {
                "answer": "2343423423",
                "type": "Twilio.PHONE_NUMBER",
                "filled": true,
                "attempts": 1,
                "validate_attempts": 1,
                "confirm_attempts": 0,
                "confirmed": false
              }
            }
          }
        }
      }
    }`,
    Channel: 'voice',
  };

  function callback(error, data) {
    if (error) {
      console.log('error: ' + error);
    } else {
      //console.log(JSON.stringify(data));
      expect.assertions(1);
      expect(data.actions[1].collect.questions[0].question).toMatch(/Please provide me your Account Number/);
      done();
    }
  }

  eventHandler.TFN_Lookup(context, event, callback,responseBuilder.RB);
