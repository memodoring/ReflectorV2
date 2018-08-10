const Alexa = require(`ask-sdk-core`);

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

const IntentReflectorHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `IntentRequest`;
  },
  handle(handlerInput){
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    //To Do: add support for slots
    //To Do: add support for locale
    return handlerInput.responseBuilder
      .speak(intentName)
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
      .speak(`Oops! Looks like you forgot to register a handler.`)
      .getResponse();
  },
};

const GenericErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(`There was an error. The stack trace has been logged to Cloud-Watch.`)
      .reprompt(`Sorry, an error occurred.`)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    IntentReflectorHandler,
    LaunchReflectorHandler,
    SessionEndedReflectorHandler
  )
  .addErrorHandlers(
    RequestHandlerChainErrorHandler,
    GenericErrorHandler
  )
  .lambda();
