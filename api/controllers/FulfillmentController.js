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
    // var surgery = await db.collection('surgery').get()
    var user_record = await db.collection('user_record').get()
    // var user_record_id = await db.collection('user_record').doc();
    // console.log(user_record_id);
    //var optionA = await db.collection('surgery').doc('34').get()
    // console.log(surgery);

    var tempArray = [];

    // user_record_id.forEach(function (snapshot){
    //   var data = snapshot.data()
    //   tempArray.push({
    //     id: data.id
    //   })
    // })
    // .catch(err => {
    //   console.log('Error getting documents', err);
    // });

    user_record.forEach(function (snapshot) {
      var data = snapshot.data()
      tempArray.push({
        doctorName: data.doctorName,
        hospitalName: data.hospitalName,
        otherHospitalName: data.otherHospitalName,
        totalCost:  data.totalCost,
        surgeryName: data.surgeryName,
        surgeryNo: data.surgeryNo,
        generalCode: data.generalCode,
        specificCode: data.specificCode,
        specialCaseComplex: data.specialCaseComplex,
        detailOfSpecficC: data.detailOfSpecficC

      })
    });

    res.set('Content-type', 'text/csv');
    csv.write(tempArray, { headers: true }).pipe(res);

  },
};