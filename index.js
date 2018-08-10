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

//=========================================================================================================================================
//Helper functions
//=========================================================================================================================================

function getSlotValues(filledSlots) {
  const slotValues = {};

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
  Object.keys(filledSlots).forEach((item) => {
      const name = filledSlots[item].name;

      if (filledSlots[item] &&
      filledSlots[item].resolutions &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
      switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
          case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
              synonym: filledSlots[item].value,
              value: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
              id: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id,
              isValidated: true,
              canUnderstand: "YES",
              canFulfill: "YES",
          };
          break;
          case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
              synonym: filledSlots[item].value,
              value: filledSlots[item].value,
              id: null,
              isValidated: false,
              canUnderstand: "NO",
              canFulfill: "MAYBE",            
          };
          break;
          default:
          break;
      }
      } else {
      slotValues[name] = {
          synonym: filledSlots[item].value,
          value: filledSlots[item].value,
          id: filledSlots[item].id,
          isValidated: false,
          canUnderstand: "NO",
          canFulfill: "NO",        
      };
      }
  }, this);

  return slotValues;
}