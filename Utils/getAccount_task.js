// reference to function with exports.handler
// const functions = Runtime.getFunctions();
// let PA = require(functions['PaymentArrangement'].path);
const eventHandler = require('../functions/getAccount_task.js');
const responseBuilder = require('./response_builder.js');
 
const context = {};
const event = {
AccountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
AssistantSid: 'UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
DialogueSid: 'UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
date_created: '',
UserIdentifier: '+14151234567',
CurrentInput: 'agent',
CurrentTask: 'fallback',
DialoguePayloadUrl:
'https://autopilot.twilio.com/v1/Assistants/UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1/Dialogues/UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
 //Memory: {

    // "AccountNo":"14296104",
// "PaymentAmt":800,
// "AgentTransfer":false,
// "InstallmentPayment":0,
// "NP":0,
// "FP":0,
// "start_date":"",
// "InstallmentStart_Date":"",
// "Frequency":"",
// "FACSFreq":"",
// "LegalAnnounce":""
// 
// Remember: `{
//     "task_fail_counter": 0,
//     "repeat": false,
//     "user_phone_number": "+14151234567",
//     "clientData": {
//         "clientName": "Convergent Outsourcing",
//         "mailingAddress": " Convergent Outsourcing Incorporated ,   P O Box 9 0 0 4  ,   Renton  ,   Washington ,   9 8 0 5 7",
//         "webPaymentAddress": "payconvergent.com",
//         "transferAgentNumber": "+18334050479",
//         "namespace": "RED",
//         "channel": "SendGrid Email",
//         "host": "FACS"
//     }
Memory: `{
	"user_phone_number": "+181234567895",
	"clientData": {
		"transferAgentNumber": "+18334050479",
		"user_phone_number": "user",
		"clientName": "Convergent Outsourcing",
		"mailingAddress": " Convergent Outsourcing Incorporated ,   P O Box 9 0 0 4  ,   Renton  ,   Washington ,   9 8 0 5 7",
		"webPaymentAddress": "payconvergent.com",
		"F_Letter_Namespace": "R",
		"namespace": "RED",
		"channel": "SendGrid Email",
		"host": "FACS",
		"TFN": "8559092691"
	},
	"twilio": {
		"collected_data": {
			"collect_Accountnumber": {
				"status": "complete",
				"date_started": "2020-12-31T19:18:02Z",
				"date_completed": "2020-12-31T19:18:09Z",
				"answers": {
					"NumberOfacct": {
						"answer": "0215478521021",
						"filled": true,
						"attempts": 1,
						"validate_attempts": 1,
						"confirm_attempts": 0,
						"confirmed": false
					}
				}
			}
		}
	},
	"TFN": "8559092691"

    }`,

Field_yes_no_Value: 'No',
Channel: 'voice',
};
 
function callback(error, data) {
if (error) {
console.log('error: ' + error);
} else {
console.log(JSON.stringify(data));
}
}
 
// call the function
eventHandler.getAccount_task(context, event, callback,responseBuilder.RB);
