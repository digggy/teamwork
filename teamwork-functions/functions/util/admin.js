const admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://teamwork-f8d50.firebaseio.com",
  storageBucket: "teamwork-f8d50.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };
