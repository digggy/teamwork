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
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onScreamDelete = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => console.error(err));
  });
