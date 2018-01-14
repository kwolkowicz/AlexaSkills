
'use strict';

var GreetingsSkill = require('./GreetingsSkill'),
    greetings = require('./greetings');

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var HowTo = function () {
    GreetingsSkill.call(this, APP_ID);
};

// Extend GreetingsSkill
HowTo.prototype = Object.create(GreetingsSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Who is comming? I would like to know who i need to welcome...";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Sorry I did not understand, can you please repeat who is comming?";
    response.ask(speechText, repromptText);
};

HowTo.prototype.intentHandlers = {
    "WelcomeIntent": function (intent, session, response) {
        var welcomeSlot = intent.slots.Guest,
            guestName;
        if (welcomeSlot && welcomeSlot.value){
            guestName = welcomeSlot.value.toLowerCase();
        }

        var cardTitle = "Following guest was welcome " + guestName,
            welcomeLine = greetings[guestName],
            speechOutput,
            repromptOutput;
        if (welcomeLine) {
            speechOutput = {
                speech: welcomeLine,
                type: GreetingsSkill.speechOutputType.SSML
            };
            response.tellWithCard(speechOutput, cardTitle, welcomeLine);
        } else {
            var speech;
            if (guestName) {
                speech = "I'm sorry, I currently do not know the greetings line for  " + guestName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know the greetings line for . What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: GreetingsSkill.speechOutputType.SSML
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: GreetingsSkill.speechOutputType.SSML
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions such as, what's the answer, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what's the greetings line, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: GreetingsSkill.speechOutputType.SSML
        };
        var repromptOutput = {
            speech: repromptText,
            type: GreetingsSkill.speechOutputType.SSML
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};
