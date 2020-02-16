const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbauth");
const { db } = require("./util/admin");
const {
  getAllScreams,
  getScream,
  postOneScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require("./handlers/screams");
const {
  signup,
  login,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
  uploadImage
} = require("./handlers/users");

// Scream Routes
app.get("/screams", getAllScreams); // Get all Screams
app.post("/scream", FBAuth, postOneScream); // Post a scream
app.get("/scream/:screamId", getScream);
// Delete scream
app.delete("/scream/:screamId", FBAuth, deleteScream);
// Like scream
app.get("/scream/:screamId/like", FBAuth, likeScream);
// Unlike scream
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
// Comment scream
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

// Users Route
app.post("/signup", signup); // Signup route
app.post("/login", login); // Login route
app.get("/user", FBAuth, getAuthenticatedUser); // Get current user data
app.get("/user/:handle", getUserDetails); // Get current user data
app.post("/user", FBAuth, addUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);
app.post("/user/image", FBAuth, uploadImage); // Upload an image

// https://baseurl.com//api/
exports.api = functions.region("europe-west1").https.onRequest(app);

// Database triggers for notification
exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });
