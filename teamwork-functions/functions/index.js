const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

const app = require("express")();

const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyDYJsotoMLEVHEJWEtW6HMfHn9VKUJhHog",
  authDomain: "teamwork-f8d50.firebaseapp.com",
  databaseURL: "https://teamwork-f8d50.firebaseio.com",
  projectId: "teamwork-f8d50",
  storageBucket: "teamwork-f8d50.appspot.com",
  messagingSenderId: "424615047706",
  appId: "1:424615047706:web:526ca282e3bbebfb3357a3",
  measurementId: "G-7PD54673Z9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://teamwork-f8d50.firebaseio.com"
});

const db = admin.firestore();

app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});
app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  return db
    .collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `Document ${doc.id} created sucessfully` });
    })
    .catch(err => {
      res
        .status(500)
        .json({ err: "Something went wrong", msg: JSON.stringify(req.body) });
      console.error(err);
    });
});

// Signup route

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // TODO validate data
  let token, userId;
  db.doc(`/user/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: `This handle is already taken` });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idtoken => {
      token = idtoken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

// https://baseurl.com//api/
exports.api = functions.region("europe-west1").https.onRequest(app);
