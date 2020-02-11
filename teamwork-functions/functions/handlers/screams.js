const { db } = require("../util/admin");

exports.getAllScreams = (req, res) => {
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
};

exports.postOneScream = (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
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
};
