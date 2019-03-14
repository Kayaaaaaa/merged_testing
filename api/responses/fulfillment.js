import firebase from "firebase";
var firebase = require("firebase");
import * as admin from 'firebase-admin';
var admin = require('firebase-admin');

var serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wecarebill-92132.firebaseio.com'
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'wecarebill-92132',
    clientEmail: 'foo@wecarebill-92132.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nAIzaSyATvX8K5MUO6PNF_44rSPW2o9FGQSEJu1w\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://wecarebill-92132.firebaseio.com'
});

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wecarebill-92132.firebaseio.com'
});

var refreshToken; // Get refresh token from OAuth2 flow

admin.initializeApp({
  credential: admin.credential.refreshToken(refreshToken),
  databaseURL: 'https://wecarebill-92132.firebaseio.com'
});

var admin = require('firebase-admin');
var app = admin.initializeApp();

var config = {
  apiKey: "AIzaSyATvX8K5MUO6PNF_44rSPW2o9FGQSEJu1w",
  authDomain: "wecarebill-92132.firebaseapp.com",
  databaseURL: "https://wecarebill-92132.firebaseio.com",
  projectId: "wecarebill-92132",
  storageBucket: "wecarebill-92132.appspot.com",
  messagingSenderId: "45479658617"
};
firebase.initializeApp(config);

module.exports = function () {

  var req = this.req;
  var res = this.res;

  const { WebhookClient } = require('dialogflow-fulfillment');
  // const {Card, Suggestion} = require('dialogflow-fulfillment');

  const agent = new WebhookClient({ request: req, response: res });

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function checking(agent){
    agent.add('Dummy')
  }

  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Default Fallback Intent', checking);
  // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
  agent.handleRequest(intentMap);

  
}
