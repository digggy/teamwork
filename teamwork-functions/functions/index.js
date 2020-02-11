const functions = require("firebase-functions");
const app = require("express")();

const { FBAuth } = require("./util/fbauth");
const { getAllScreams } = require("./handlers/screams");
const { signup, login } = require("./handlers/users");

// Scream Routes
app.get("/screams", getAllScreams); // Get all Screams
app.post("/scream", FBAuth, postOneScream); // Post a scream

// Users Route
app.post("/signup", signup); // Signup route
app.post("/login", login); // Login route

// https://baseurl.com//api/
exports.api = functions.region("europe-west1").https.onRequest(app);
