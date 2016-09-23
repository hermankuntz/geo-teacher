'use strict';
var Alexa = require('alexa-sdk');
var data = require('data/database.js');
var APP_ID = 'amzn1.ask.skill.cb1bcb77-9af2-4a3a-99f6-afad2aa5d49d';
var SKILL_NAME = 'Geo Teacher';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

var intro = [
    "Let's travel to {0} ",
    "Let's go to {0} ",
    "Let's speak about {0} ",
    "What about {0} "
]

var country_codes = Object.keys(data);

var handlers = {
    'LaunchRequest': function () {
        console.log('LaunchRequest');
        this.emit('ResponseIntent');
    },
    'GeoTeacherIntent': function () {
        console.log('DiceRollerIntent');
        this.emit('ResponseIntent');
    },
    'ResponseIntent': function () {

        var rand_code = country_codes[Math.floor(Math.random()*country_codes.length)];
        var country = data[rand_code];

        console.log("country : "+JSON.stringify(country));

        var speechOutput = intro[Math.floor(Math.random()*intro.length)].format(country['name']);
        speechOutput+="<break time='0.3s' />";
        var area = Math.floor(country['area']*0.386102)+1;
        speechOutput+="This country covers an area of "+area+" square miles ";

        if(country['region'] != "") speechOutput+="in "+country['region']+". ";

        // border country part
        if(!country['borders'] || country['borders'].length == 0){
            speechOutput+="it is an island";
        }else if(country['borders'].length == 1){
            speechOutput+="It has one border country, "+data[country['borders'][0]]['name'];
        }else{
            speechOutput+="It has "+country['borders'].length+" border countries";

            var i=0;
            while(i < country['borders'].length - 1){
                speechOutput+=", "+data[country['borders'][i]]['name'];
                i++;
            }

            speechOutput+=" and "+data[country['borders'][i]]['name'];

        }

        //capital
        speechOutput+=".<break time='0.3s' />";
        speechOutput+="The capital of "+country['name']+" is "+country['capital'];

        speechOutput+=".<break time='0.3s' />";
        speechOutput+="People who live in "+country['name']+" are called "+country['demonym'];


        // language part
        var l_keys = Object.keys(country['languages']);
        if(l_keys.length == 1){
            speechOutput+=" and they speak "+country['languages'][Object.keys(country['languages'])[0]];
        }else if(l_keys.length > 1){
            speechOutput+=" and they use "+l_keys.length+" different languages"

            var i=0;
            while(i < l_keys.length - 1){
                speechOutput+=", "+country['languages'][l_keys[i]];
                i++;
            }

            speechOutput+=" and "+country['languages'][l_keys[i]];
        }

        this.emit(':tell', speechOutput, SKILL_NAME, speechOutput);

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can ask me to roll a dice, just ask Alexa <break time='0.3s' /> start dice roller";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};

