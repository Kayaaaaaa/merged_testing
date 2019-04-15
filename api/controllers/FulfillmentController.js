/**
 * FulfillmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  index: async function (req, res) {
    return res.ok('ok')
  },

  download: async function (req, res) {

    var csv = require("fast-csv");

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
        totalCost: data.totalCost,
        surgeryCode: data.surgeryCode,
        generalCode: data.generalCode,
        specificCode: data.specificCode,
        specialCaseComplex: data.specialCaseComplex,
        detailOfSpecificC: data.detailOfSpecificC,
      })
    });
    res.set('Content-type', 'text/csv');
    csv.write(tempArray, { headers: true }).pipe(res);
  },

  upload: async function (req, res) {

    if (req.method == 'GET')
      return res.view('user/upload');

    const csv = require("fast-csv");
    var db = sails.firebaseAdmin.firestore();

    var surgerynoBuffer = new Buffer(req.body.surgeryno[1].split(",")[1], 'base64').toString('utf8');
    var optionmapBuffer = new Buffer(req.body.optionmap[1].split(",")[1], 'base64').toString('utf8');
    var calibrationBuffer = new Buffer(req.body.calibration[1].split(",")[1], 'base64').toString('utf8');
    var hospitalBuffer = new Buffer(req.body.hospital[1].split(",")[1], 'base64').toString('utf8');

    ////////////////////Surgery Number//////////////////////////////////////

    await new Promise((resolve, reject) => {
      var index = 0;
      var batch = db.batch();
      csv.fromString(surgerynoBuffer, { headers: false }).on("data", function (data) {
        if (index == 0) {
          index++;
          return;
        }

        console.log(data);
        if (data[0]) {
          batch.set(db.collection('surgery').doc(data[0]), {
            "id": data[0],
            "content": data[1],
            "內容": data[2] ? data[2] : '',
            "specialist": data[3],
          }, { merge: true });
        }
        index++;
      }).on("end", function () {
        batch.commit().then(function () {
          console.log('surgeryno end');
          resolve();
        });
      });
    });

    ///////////////////////////option mapping////////////////////////////////////// 
    await new Promise((resolve, reject) => {
      var index = 0;
      var batch = db.batch();

      csv.fromString(optionmapBuffer, { headers: false }).on("data", function (data) {
        if (index == 0 || index == 1 || !(data[3] && data[4])) {
          index++;
          return;
        }

        if (data[1]) {
          //general option
          if (data[1].toString().startsWith("General")) {
            if (data[2]) {
              var conA = {};
              conA[data[2]] = data[3] || '';
              batch.set(db.collection('general').doc('option'), conA, { merge: true });
            }

            if (data[3] && data[2]) {
              for (var gencount = 4, genno = 1; data[gencount]; gencount++ , genno++) {
                console.log('path = ' + db.collection('general').doc('option').collection(data[2]).doc(genno.toString()).path);
                batch.set(db.collection('general').doc('option').collection(data[2]).doc('' + genno), {
                  "content": data[gencount],
                  "內容": data[gencount],
                }, { merge: true });
              }
            }
            console.log('general');
            index++;
            return;
          }

          console.log(data);
          var surCode = data[1].replace(data[2], '');
          var opCode = data[1].replace(surCode, '');

          if (data[2] && data[3] && (opCode == data[2])) {
            console.log('data 2');
            var con = {};
            con[data[2]] = data[3] || '';
            batch.set(db.collection('surgery').doc(surCode).collection('option').doc('specific'), con, { merge: true });
            for (var surcount = 4, surno = 1; data[surcount]; surcount++ , surno++) {
              batch.set(db.collection('surgery').doc(surCode).collection('option').doc('specific').collection(data[2]).doc('' + surno), {
                "content": data[surcount],
                "內容": data[surcount],
              }, { merge: true });
            }
          }
          index++;
          return;
        }
      }).on("end", function () {
        batch.commit().then(function () {
          console.log('optionmap end');
          resolve();
        });
      });

    });
    //     ////////////////////////CALIBRATION///////////////////////////////////////
    await new Promise((resolve, reject) => {
      var index = 0;
      var batch = db.batch();
      csv.fromString(calibrationBuffer, { headers: false }).on("data", function (data) {
        if (index == 0) {
          index++;
          return;
        }
        if (index == 1) {
          index++;
          return;
        }

        // console.log()
        console.log(data);
        if (data[4]) {
          /////////////extract surgery number & surgery option//////////
          //data[4] = name 

          var cSurgeryNo = (data[4].toLowerCase().match(/^([\d]+)/g) || [])[0];//take out surgery number e.g. 121
          var cSurgeryOptionNum = (data[4].toLowerCase().match(/([\d]+)$/g) || [])[0];//take out surgery option number e.g. 1 from A1
          if (cSurgeryNo && cSurgeryOptionNum)
            var cSurgeryOption = data[4].toUpperCase().replace(cSurgeryNo, '').replace(cSurgeryOptionNum, '');//take out the option GeneralA/A(specific)


          var amountString = data[7];//price
          var amount = parseInt(amountString);
          var agePercentageString = data[6].replace('%', '');//extract digits but no %
          var agePercentage = parseInt(agePercentageString) / 100;
          // var agePercentage = data[6].match(/^[\d]+/g);//extract digits but no %
          var usePercentageString = data[50].match(/^[\d]+/g);//extract digits but no %
          var usePercentage = parseInt(usePercentageString);

          // var d = {};//no need this as read line by line

          if (cSurgeryNo) {

            ////////////Base Case/////////////
            if (data[4].toLowerCase().includes("base")) {
              // d['cSurgeryNo'] = data[7];
              batch.set(db.collection('surgery').doc(cSurgeryNo), {
                "baseline_price": amount,
              }, { merge: true });//overwrite the field
            } else if (data[4].toLowerCase().includes("lower")) {
              // d['cSurgeryNo'] = data[7];
              batch.set(db.collection('surgery').doc(cSurgeryNo), {
                "lowerBaselinePrice": amount,
              }, { merge: true });
            } else if (data[4].toLowerCase().includes("upper")) {
              batch.set(db.collection('surgery').doc(cSurgeryNo), {
                "upperBaselinePrice": amount,
              }, { merge: true });
            } else if (data[4].toLowerCase().includes("docfeehkrange")) {
              batch.set(db.collection('surgery').doc(cSurgeryNo), {
                "range": amount,
              }, { merge: true });
            }
            else if (cSurgeryOptionNum) {
              if (data[4].toLowerCase().includes('general')) {
                // var generalOption = data[4].toLowerCase().replace('general', '');
                var generalOption = cSurgeryOption.toUpperCase().replace('GENERAL', '');
                batch.set(db.collection('surgery').doc(cSurgeryNo).collection('option').doc('general').collection(generalOption).doc(cSurgeryOptionNum), {
                  // "baseline_price": data[7],
                  "percentage": agePercentage,
                  "price": amount,
                  "content": data[5],
                  "內容": data[5],
                }, { merge: true });

                /////////////////////////////
                var sourceNo = 1;
                var sourceNoString = sourceNo.toString();
                var name = 'source_';
                var sourceName = name.concat(sourceNoString);
                var sourceAmount = parseInt("");
                var sourceUse = "";

                batch.set(db.collection('surgery').doc(cSurgeryNo).collection('option').doc('general').collection(generalOption).doc(cSurgeryOptionNum).collection('price_history').doc(sourceName), {
                  // "baseline_price": data[7],
                  "percentage": usePercentage,
                  "price": sourceAmount,
                  "use": sourceUse,
                }, { merge: true });
                sourceNo++;

              }
              ////////////////////////////////////////////////////
              else {
                batch.set(db.collection('surgery').doc(cSurgeryNo).collection('option').doc('specific').collection(cSurgeryOption).doc(cSurgeryOptionNum), {
                  // "baseline_price": data[7],
                  "percentage": agePercentage,
                  "price": amount,
                  "content": data[5],
                  "內容": data[5],
                }, { merge: true });

                //////////////////////////////////////////
                var sourceNo = 1;
                var sourceNoString = sourceNo.toString();
                var name = 'source_';
                var sourceName = name.concat(sourceNoString);
                var sourceAmount = parseInt("");
                var sourceUse = "";

                batch.set(db.collection('surgery').doc(cSurgeryNo).collection('option').doc('specific').collection(cSurgeryOption).doc(cSurgeryOptionNum).collection('price_history').doc(sourceName), {
                  // "baseline_price": data[7],
                  "percentage": usePercentage,
                  "price": sourceAmount,
                  "use": sourceUse,
                }, { merge: true });
                sourceNo++;
              }
            }

          }
          else if (data[4].toLowerCase.startsWith('general')) {

            var cSurgeryOptionNum = (data[4].toLowerCase().match(/([\d]+)$/g) || [])[0];

            var cSurgeryOption = data[4].toUpperCase().replace(GENERAL, '').replace(cSurgeryOptionNum, '');

            batch.set(db.collection('general').doc('option').collection(cSurgeryOption).doc(cSurgeryOptionNum).collection(cSurgeryOption).doc(cSurgeryOptionNum), {
              // "baseline_price": data[7],
              "percentage": agePercentage,
              "price": amount,
              "content": data[5],
              "內容": data[5],
            }, { merge: true });

            //////////////////////////////////////////
            var sourceNo = 1;
            var sourceNoString = sourceNo.toString();
            var name = 'source_';
            var sourceName = name.concat(sourceNoString);
            var sourceAmount = parseInt("");
            var sourceUse = "";

            batch.set(db.collection('general').doc('option').collection(cSurgeryOption).doc(cSurgeryOptionNum).collection('price_history').doc(sourceName), {
              // "baseline_price": data[7],
              "percentage": usePercentage,
              "price": sourceAmount,
              "use": sourceUse,
            }, { merge: true });
            sourceNo++;

          }

          //////////////////////////////////////////

        }

        index++;
      }).on("end", function () {
        batch.commit().then(function () {
          console.log('calibration end');
          resolve();
        });

      });
    });
    // ///////////////////////HOSIPITAL CODE////////////////////////////
    await new Promise((resolve, reject) => {
      var index = 0;
      var batch = db.batch();

      csv.fromString(hospitalBuffer, { headers: false }).on("data", function (data) {
        if (index == 0) {
          index++;
          return;
        }
        if (index == 1) {
          index++;
          return;
        }

        // console.log()
        console.log(data);
        if (data[0] && data[1]) {

          batch.set(db.collection('hospital').doc(data[0]), {
            "id": data[0],
            "content": data[1],
            "內容": data[1],

          });
        }

        index++;
      }).on("end", function () {
        batch.commit().then(function () {
          console.log('hospital end');
          resolve();
        });

      });
    });


    console.log(req.body);

    return res.ok("Files uploaded successfully");

  },

};