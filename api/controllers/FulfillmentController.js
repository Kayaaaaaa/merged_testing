/**
 * FulfillmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  // index: async function (req, res) {
  //   return res.fulfillment();
  // },
  index: async function (req, res) {
    return res.ok('ok')
},

  index2: async function (req, res) {

    var csv = require("fast-csv");
    // import firebase from "firebase";
    // var firebase = require("firebase");
    // import * as admin from 'firebase-admin';

    var db = sails.firebaseAdmin.firestore();
    var surgery = await db.collection('surgery').get()
    //var optionA = await db.collection('surgery').doc('34').get()
    // console.log(surgery);

    var tempArray = [];

    surgery.forEach(function (snapshot) {
      var data = snapshot.data()
      tempArray.push({
        id: data.id,
        title: data.title,
        content: data.content,
        specialist: data.specialist
      })
    });

    res.set('Content-type', 'text/csv');
    csv.write(tempArray, { headers: true }).pipe(res);

  },
};