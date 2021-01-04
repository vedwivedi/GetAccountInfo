const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home';

exports.ZipOrSSN_Task =async function(context, event, callback,RB) {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = true;
    let Remember = {};
    let Tasks = false;
    let Redirect = true;
    let Handoff = false;
    
    const Memory = JSON.parse(event.Memory);
  //    console.log("Memory:");
    let enterdigit = Memory.twilio.collected_data.collect_comments.answers.comments.answer;
  //   let AccStatus = false;
   
     //let enterdigit = event.ValidateFieldAnswer;
     console.log("enterdigit:" +enterdigit);
     if(enterdigit == 2 ||  enterdigit == 'no' || enterdigit == 'No')
     {
      //   Remember.collected_data.collect_Accountnumber.answers.NumberOfacct.answer = null
      //  console.log("check : "+enterdigit);
      //  console.log("Remembercheck : "+ Remember.userData);
       Say = false;
       Listen = false;
       Collect = false;
       Redirect = true;
       Redirect = "task://NameNotMatch" ;
     }
     else
      {
        Say = false;
        Listen = false;
        Collect = true;
        Redirect = false;
        
        console.log("inner function ZipOrSSN_Taks");
        Collect =  {
            "name": "collect_ziporssn",
            "questions": [
                    {
                    "question": "For your account verification   input 5 digits or Say of your  Zip code or last 4 digits of your Social Security number.",
                    //"prefill": "NumberOfacct",
                    "name": "ziporssn",
                    "voice_digits": {
                      "num_digits": 10,
                      "finish_on_key": "#"
                      
                    },
                    
                    "validate": {
                      "on_failure": {
                        "messages": [
                          {
                            "say": "Sorry, that's not a valid  ."
                          },
                          {
                            "say": "Hmm, I'm not understanding. "
                          }
                        ],
                        "repeat_question": true
                      },
                      "webhook": {
                        "url": "https://getaccountinfo-8115-dev.twil.io/validateziporssn",
                        "method": "POST"
                      },
                      "on_success": {
                        "say": "Thank you for validating your account"
                      },
                      "max_attempts": {
                        "redirect": "task://agent_transfer",
                        "num_attempts": 3
                      }
                    }
                    }
      
                  ],
            "on_complete": {
            "redirect": 	 "task://set_MM"
                    }
          };
        
      }
      console.log(Collect);

    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
 
  
    
 