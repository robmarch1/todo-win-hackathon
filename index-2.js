"use strict";

var States = {
    Start: "_StartState",
    RiskCapture: "_RiskCaptureState",
    HelpState: "_HelpState"
}

var QuestionsFlow = {
    question1: "hi",
    question2: "hi"
};

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = undefined;
    alexa.registerHandlers(AutoInsurer.newSessionHandlers, AutoInsurer.riskCaptureStateHandlers, AutoInsurer.triviaStateHandlers, AutoInsurer.helpStateHandlers);
    alexa.execute();
};

var AutoInsurer = {

    newSessionHandlers: {

    },

    startStateHandlers: {

    },

    riskCaptureStateHandlers: {

    },

    helpStateHandlers: {

    }

};