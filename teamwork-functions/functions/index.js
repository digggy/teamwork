const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbauth");
const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login, uploadImage } = require("./handlers/users");

// Scream Routes
app.get("/screams", getAllScreams); // Get all Screams
app.post("/scream", FBAuth, postOneScream); // Post a scream

// Users Route
app.post("/signup", signup); // Signup route
app.post("/login", login); // Login route
app.post("/user/image", FBAuth, uploadImage);

// https://baseurl.com//api/
exports.api = functions.region("europe-west1").https.onRequest(app);
