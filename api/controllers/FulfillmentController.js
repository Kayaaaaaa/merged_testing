/**
 * FulfillmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  index: async function (req, res) {
    return res.fulfillment();
  },

  index2: async function (req, res) {

    // import firebase from "firebase";
    // var firebase = require("firebase");
    // import * as admin from 'firebase-admin';
    var admin = require('firebase-admin');

    var serviceAccount = require(sails.config.appPath + '/wecarebill-92132-firebase-adminsdk-7usxj-6240df0e36.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://wecarebill-92132.firebaseio.com'

    });

    var db = admin.firestore();
    var surgery = await db.collection('surgery').doc('58').collection('option').doc('general').get()
    console.log(surgery);
    return res.ok();
  },
};

