var supertest = require('supertest');

describe('FulfillmentController.fulfillment', function() {
  it('should response status 200 with JSON', function (done) {
      supertest(sails.hooks.http.app)
      .post('/')
      .send({"responseId":"8c4a0e8d-0fdd-4ca8-95cc-99b0781eb852","queryResult":{"queryText":"hi","action":"input.welcome","parameters":{},"allRequiredParamsPresent":true,"fulfillmentText":"Good day! What can I do for you today?","fulfillmentMessages":[{"text":{"text":["Hello! How can I help you?"]}}],"intent":{"name":"projects/sails-f487a/agent/intents/4623820f-8b0c-462b-b946-1117c0c0113d","displayName":"Default Welcome Intent"},"intentDetectionConfidence":1,"languageCode":"en"},"originalDetectIntentRequest":{"payload":{}},"session":"projects/sails-f487a/agent/sessions/fb429d40-557d-2b66-2c81-58568eaf6111"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200, {
	  "fulfillmentText": "Welcome to my agent!",
	  "outputContexts": []
      }, done);
    });
});
