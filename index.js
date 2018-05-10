/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const IntentReflectorHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `IntentRequest`;
  },
  handle(handlerInput){
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    return handlerInput.responseBuilder
      .speak(intentName)
      .getResponse();
  }
};

const LaunchReflectorHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput){
    const requestType = handlerInput.requestEnvelope.request.type;
    return handlerInput.responseBuilder
      .speak(requestType)
      .getResponse();
  }
};

const SessionEndedReflectorHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `SessionEndedRequest`;
  },
  handle(handlerInput){
    const requestType = handlerInput.requestEnvelope.request.type;
    const sessionEndedReason = handlerInput.requestEnvelope.request.reason;
    console.log(`~~~~~~~~~~~~~~~~~~~`);
    console.log(requestType+ " "+sessionEndedReason);
    console.log(`~~~~~~~~~~~~~~~~~~~`);
  }
};

const RequestHandlerChainErrorHandler = {
  canHandle(handlerInput, error) {
    console.log(`~~~~~~~~~`)
    console.log(error.message)
    console.log(`~~~~~~~~~`)
    return error.message === `RequestHandlerChain not found!`;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Oops! Looks like you forgot to register a handler again')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    IntentReflectorHandler,
    LaunchReflectorHandler,
  )
  .addErrorHandlers(
    RequestHandlerChainErrorHandler,
    ErrorHandler
  )
  .lambda();
