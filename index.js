"use strict";

var States = {
    Start: "_StartState",
    DeviceSelection: "_DeviceSelection",
    Quote: "_QuoteState",
    Payment: "_PaymentState",
    AmazonPayMethod: "_AmazonPayMethod",
    VisaAccNo: "_VisaAccountNumberState",
    VisaSortCode: "_VisaSortCodeState",
    VisaCVC: "_VisaCVCState",
    PayPal: "_PayPalPaymentState",
    Confirmation: "_ConfirmationState",
    Help: "_HelpState"
}

var languageString = {
    "en": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Auto Insurer. Do you want to automatically insure one of your devices?",
            "START_UNHANDLED": "Welcome to Auto Insurer. You can ask me to automatically insure any of your connected devices.",
            "STOP_MESSAGE": "Are you sure you'd like to stop?",
            "CANCEL_MESSAGE": "Cool, laters bro",
            "DEVICE_SELECTION_MESSAGE": "Which of the following devices do you want to insure? Samsung Galaxy S5 Neo. Apple iPhone 7.",
            "QUOTE_MESSAGE": "Ok. I've found a quote for 13 pounds 72 pence per year. Would you like to proceed with this?",
            "PAYMENT_MESSAGE": "You can pay using a card linked to your amazon account, or by Visa or PayPal. How would you like to pay?",
            "PAYMENT_METHOD_UNRECOGNISED_MESSAGE": "I'm sorry, I didn't understand that. ",
            "PAY_BY_AMAZON_ACCOUNT_MESSAGE": "Are you happy to proceed to pay through your Amazon Account?",
            "PAY_BY_VISA_MESSAGE_CARD_NO": "To pay using a Visa credit, or debit card, please tell me your card number.",
            "PAY_BY_VISA_MESSAGE_SORT_CODE": "What is your sort code?",
            "PAY_BY_VISA_MESSAGE_CVC": "What is your card security code? This is the last three digits of the number on the back of your card.",
            "PAY_BY_PAYPAL_USERNAME": "What is your PayPal username?",
            "WRAPUP_COMPLETE_MESSAGE": "Payment successful! Your device has been insured and your policy documents are on their way by email. Thanks!"
        }
    }
};

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {

    var AutoInsurer = {

        newSessionHandlers: {
            "LaunchRequest": function () {
                this.handler.state = States.Start;
                this.emitWithState("StartRiskCapture");
            },
            "AMAZON.StartOverIntent": function() {
                this.handler.state = States.Start;
                this.emitWithState("StartRiskCapture");
            },
            "Unhandled": function () { // See https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/issues/43
                this.emit(":tell", this.t("START_UNHANDLED"));
            }
        },

        startStateHandlers: function() {
            return Alexa.CreateStateHandler(States.Start, {
                "StartRiskCapture": function () {
                    var speechOutput = this.t("WELCOME_MESSAGE");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "AMAZON.YesIntent": function() {
                    this.handler.state = States.DeviceSelection;
                    this.emitWithState("DeviceSelection");
                },
                "AMAZON.NoIntent": function() {
                    this.emit(":tell", this.t("CANCEL_MESSAGE"));
                }
           });
        },

        deviceSelectionHandlers: function() {
            return Alexa.CreateStateHandler(States.DeviceSelection, {
                "DeviceSelection": function() {
                    var speechOutput = this.t("DEVICE_SELECTION_MESSAGE");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "Samsung": function() {
                    this.handler.state = States.Quote;
                    this.emitWithState("Quote");
                },
                "IPhone": function() {
                    this.handler.state = States.Quote;
                    this.emitWithState("Quote");
                },
                "Unhandled": function() {
                    var speechOutput = this.t("PAYMENT_METHOD_UNRECOGNISED_MESSAGE") + this.t("DEVICE_SELECTION_MESSAGE");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                }
            });
        },

        quoteStateHandlers: function() {
            return Alexa.CreateStateHandler(States.Quote, {
                "Quote": function () {
                    var speechOutput = this.t("QUOTE_MESSAGE");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "AMAZON.YesIntent": function() {
                    this.handler.state = States.Payment;
                    this.emitWithState("Payment");
                },
                "AMAZON.NoIntent": function() {
                    this.emit(":tell", this.t("CANCEL_MESSAGE"));
                }
           });
        },

        paymentStateHandlers: function() {
            return Alexa.CreateStateHandler(States.Payment, {
                "Payment": function() {
                    var speechOutput = this.t("PAYMENT_MESSAGE");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "AmazonAccountPayMethod": function() {
                    this.handler.state = States.AmazonPayMethod;
                    this.emitWithState("AmazonPayMethod");
                },
                "VisaPayMethod": function() {
                    this.handler.state = States.VisaAccNo;
                    this.emitWithState("VisaAccountNumber");
                },
                "PayPalPayMethod": function() {
                    this.handler.state = States.PayPal;
                    this.emitWithState("PayPalPayment");
                },
                "Unhandled": function () {
                    var speechOutput = this.t("PAYMENT_METHOD_UNRECOGNISED_MESSAGE") + this.t("PAYMENT_MESSAGE");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
            });
        },

        amazonPayMethodHandlers: function() {
            return Alexa.CreateStateHandler(States.AmazonPayMethod, {
                "AmazonPayMethod": function() {
                    var speechOutput = this.t("PAY_BY_AMAZON_ACCOUNT_MESSAGE");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "AMAZON.YesIntent": function() {
                    this.handler.state = States.Confirmation;
                    this.emitWithState("Confirmation");
                },
                "AMAZON.NoIntent": function() {
                    this.emit(":tell", this.t("CANCEL_MESSAGE"));
                }
            });
        },

        visaAccNoStateHandlers: function() {
            return Alexa.CreateStateHandler(States.VisaAccNo, {
                "VisaAccountNumber": function() {
                    var speechOutput = this.t("PAY_BY_VISA_MESSAGE_CARD_NO");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "Unhandled": function() {
                    this.handler.state = States.VisaSortCode;
                    this.emitWithState("VisaSortCode");
                }
            });
        },

        visaSortCodeStateHandlers: function() {
            return Alexa.CreateStateHandler(States.VisaSortCode, {
                "VisaSortCode": function() {
                    var speechOutput = this.t("PAY_BY_VISA_MESSAGE_SORT_CODE");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "Unhandled": function() {
                    this.handler.state = States.VisaCVC;
                    this.emitWithState("VisaCVC");
                }
            });
        },

        visaCVCStateHandlers: function() {
            return Alexa.CreateStateHandler(States.VisaCVC, {
                "VisaCVC": function() {
                    var speechOutput = this.t("PAY_BY_VISA_MESSAGE_CVC");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "Unhandled": function() {
                    this.handler.state = States.Confirmation;
                    this.emitWithState("Confirmation");
                }
            });
        },

        payPalStateHandlers: function() {
            return Alexa.CreateStateHandler(States.PayPal, {
                "PayPalPayment": function() {
                    var speechOutput = this.t("PAY_BY_PAYPAL_USERNAME");
                    this.emit(":askWithCard", speechOutput, speechOutput, speechOutput, speechOutput);
                },
                "Unhandled": function() {
                    this.handler.state = States.Confirmation;
                    this.emitWithState("Confirmation");
                }
            });
        },

        confirmationStateHandlers: function() {
            return Alexa.CreateStateHandler(States.Confirmation, {
                "Confirmation": function() {
                    var speechOutput = this.t("WRAPUP_COMPLETE_MESSAGE");
                    this.emit(":tell", speechOutput);
                }
            });
        }
    };

    var alexa = Alexa.handler(event, context);
    alexa.appId = undefined;
    alexa.resources = languageString;
    alexa.registerHandlers(
        AutoInsurer.newSessionHandlers,
        AutoInsurer.startStateHandlers(),
        AutoInsurer.deviceSelectionHandlers(),
        AutoInsurer.quoteStateHandlers(),
        AutoInsurer.paymentStateHandlers(),
        AutoInsurer.amazonPayMethodHandlers(),
        AutoInsurer.visaAccNoStateHandlers(),
        AutoInsurer.visaSortCodeStateHandlers(),
        AutoInsurer.visaCVCStateHandlers(),
        AutoInsurer.payPalStateHandlers(),
        AutoInsurer.confirmationStateHandlers()
    );
    alexa.execute();
};
