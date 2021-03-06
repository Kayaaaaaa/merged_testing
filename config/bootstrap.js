/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */



module.exports.bootstrap = async function (done) {

  // -------for testing -------
  // var admin = require('firebase-admin');
  // var serviceAccount = require(sails.config.appPath + '/testing-d68ea-firebase-adminsdk-jl7jl-05994dc0b1.json');
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   databaseURL: 'https://testing-d68ea.firebaseio.com'
  // });

  var admin = require('firebase-admin');
  var serviceAccount = require(sails.config.appPath + '/wecarebill-92132-firebase-adminsdk-7usxj-6240df0e36.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wecarebill-92132.firebaseio.com'
  });
  sails.firebaseAdmin = admin;

  sails.bcrypt = require('bcryptjs');
  const saltRounds = 10;
  const hash = await sails.bcrypt.hash('wecarebill', saltRounds);

  await User.createEach([
    { "username": "admin", "password": hash },
    { "username": "kelly", "password": hash }
    // etc.
  ]);
  return done();

};
