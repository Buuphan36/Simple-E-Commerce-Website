const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const app = express();
var ObjectID = require("mongodb").ObjectID;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "Demo";

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// const deleteImage = () =>{

// }

// const storeImage = () =>{

// }

client.connect((error) => {
  console.log("Connected to Mongodb!");
  const db = client.db(dbName);

  app.post("/upload-image", (req, res) => {
    if (req.files === null) {
    } else {
      const file = req.files.file;
      file.mv(`../public/${file.name}`, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  });

  app.get("/delete-image", (req, res) => {
    if (!req.query.imageName) {
      console.log("No file received");
      return res.status(500).json("error in delete");
    } else {
      const fileName = req.query.imageName;
      if (fileName !== "default-profile") {
        try {
          fs.unlinkSync(`../public/${fileName}`);
          console.log("successfully deleted");
          return res.status(200).send("Successfully! Image has been Deleted");
        } catch (err) {
          // handle the error
          return res.status(400).send(err);
        }
      }
    }
  });

  app.get("/get-user-info", (req, res) => {
    console.log("info: " + JSON.stringify(req.query));
    console.log("info: " + JSON.stringify(req.body));
    //res.send(req.query)
    //const query = { _id: new ObjectID(req.query)};
    //console.log("query: " + JSON.stringify(query));
    db.collection("users")
      .findOne(req.body)
      .then((result) => {
        console.log("user info:" + JSON.stringify(result));
        const data = {
          userId: result._id,
          username: result.username,
          userEmail: result.userEmail,
          userPassword: result.userPassword,
          userProfile: result.userProfile,
        };
        res.send(data);
      });
  });

  app.post("/login", (req, res) => {
    console.log("login: " + JSON.stringify(req.body));
    db.collection("users")
      .findOne(req.body)
      .then((result) => {
        console.log("login: " + JSON.stringify(result));
        res.send(result);
      })
      .catch(() => console.log("Failed to send"));
  });

  app.post("/sign-up", (req, res) => {
    db.collection("users")
      .insertOne(req.body)
      .then(() => res.send(true))
      .catch(() => res.send(false));
  });

  app.post("/add-item", (req, res) => {
    console.log("item: " + JSON.stringify(req.body.userId));
    const item = {
      itemId: req.body.itemId,
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      file_name: req.body.file_name,
      creator_name: req.body.creator_name,
    };
    const query = { _id: new ObjectID(req.body.userId) };
    const values = { $push: { userCart: item } };
    db.collection("users")
      .updateOne(query, values)
      .then((result2) => {
        console.log(result2);
      })
      .catch((e) => console.log(e));

    //returns
    db.collection("users")
      .findOne(query)
      .then((result3) => {
        console.log(result3);
        res.send(result3.userCart);
      })
      .catch((e) => console.log(e));
  });

  app.post("/remove-item", (req, res) => {
    const query = { _id: new ObjectID(req.body.userId) };
    const values = { $pull: { userCart: { itemId: req.body.itemId } } };
    console.log("remove: " + JSON.stringify(req.body));
    db.collection("users")
      .updateOne(query, values)
      .then((result) => {
        console.log("remove: " + JSON.stringify(result));
        res.send(result);
      })
      .catch((e) => console.log(e));
  });

  app.post("/cart-item-decrease-qty", (req, res) => {
    db.collection("users")
      .findOneAndUpdate(
        {
          _id: new ObjectID(req.body.userId),
          "userCart.itemId": req.body.itemId,
        },
        {
          $set: {
            "userCart.$.quantity": req.body.quantity - 1,
          },
        }
      )
      .then((result) => {
        console.log("remove: " + JSON.stringify(result));
        res.send(result);
      })
      .catch((e) => console.log(e));
  });

  app.post("/cart-item-increase-qty", (req, res) => {
    //const query = { _id: new ObjectID(req.body.userId), userCart: {item: req.body.itemId}};
    //const values = {$set: {"userCart.$.quantity": {quantity: (req.body.quantity-1)}}}
    console.log("add qty: " + JSON.stringify(req.body));
    //console.log("remove qty values" + JSON.stringify(values));

    db.collection("users")
      .findOneAndUpdate(
        {
          _id: new ObjectID(req.body.userId),
          "userCart.itemId": req.body.itemId,
        },
        {
          $set: {
            "userCart.$.quantity": req.body.quantity + 1,
          },
        }
      )
      //.updateOne(query, values)
      .then((result) => {
        console.log("add: " + JSON.stringify(result));
        db.collection("users")
        .findOne( {_id: new ObjectID(req.body.userId)})
        .then((result1) => {
          console.log(result1);
          res.send(result1.userCart);
        });
      })
      .catch((e) => console.log(e));
  });

  app.get("/get-my-cart", (req, res) => {
    db.collection("users")
      .findOne(req.body)
      .then((result) => {
        console.log(result);
        res.send(result.userCart);
      });
  });

  app.get("/get-my-orders", (req, res) => {
    db.collection("orders")
      .find(req.query)
      .toArray()
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((e) => console.log(e));
  });

  app.get("/get-all-items", (req, res) => {
    db.collection("products")
      .find({})
      .toArray()
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((e) => console.log(e));
  });

  app.post("/create-orders", (req, res) => {
    db.collection("orders")
      .insertOne(req.body)
      .then(() => {
        res.send("success");
      })
      .catch((e) => console.log(e));
  });

  app.post("/create-post", (req, res) => {
    console.log("post: " + JSON.stringify(req.body));
    db.collection("products")
      .insertOne(req.body)
      .then(() => {
        console.log("New post");
      })
      .catch((e) => console.log(e));
  });

  app.get("/get-my-post", (req, res) => {
    db.collection("products")
      .find(req.body)
      .toArray()
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((e) => console.log(e));
  });

  app.post("/change-profile", (req, res) => {
    if (req.files === null) {
      res.send({
        success: false,
        error: "File not found!",
      });
    } else {
      const file = req.files.file;
      //stores user profile pictures into the database
      file.mv(`../public/${file.name}`, (err) => {
        if (err) {
          console.error(err);
        } else {
          const query = { _id: new ObjectID(req.query.userId) };
          const values = { $set: { userProfile: file.name } };
          console.log("File quaeries: " + JSON.stringify(query));
          console.log("File values: " + JSON.stringify(values));
          //finds user previous profile picture and delete it from the database
          db.collection("users")
            .findOne(req.files.userId)
            .then((result) => {
              console.log("before result: " + JSON.stringify(result));
              console.log("before result: " + result.userProfile);
              const fileName = result.userProfile;
              if (fileName !== "default-profile.png") {
                try {
                  fs.unlinkSync(`../public/${fileName}`);
                  console.log("successfully deleted");
                } catch (err) {
                  // handle the error
                  console.log(err);
                }
              }
            });

          //updates user profile picture
          db.collection("users")
            .updateOne(query, values)
            .then((result) => {
              console.log("file result: " + JSON.stringify(result));
              res.send({
                success: true,
                userProfile: file.name,
                error: "Profile picture has been updated!",
              });
            })
            .catch(() =>
              res.send({
                success: false,
                error: "Failed to change profile picture!",
              })
            );
        }
      });
    }
  });

  app.post("/change-username", (req, res) => {
    const query = { _id: new ObjectID(req.body.userId) };
    const values = { $set: { username: req.body.username } };
    console.log("username: " + JSON.stringify(req.body));
    db.collection("users")
      .updateOne(query, values)
      .then((result) => {
        res.send({
          success: true,
          username: req.body.username,
          error: "username has been updated!",
        });
      })
      .catch(() =>
        res.send({
          success: false,
          error: "Failed to change username!",
        })
      );
  });

  app.post("/change-email", (req, res) => {
    const query = { _id: new ObjectID(req.body.userId) };
    const values = { $set: { userEmail: req.body.userEmail } };

    db.collection("users")
      .updateOne(query, values)
      .then((result) => {
        res.send({
          success: true,
          userEmail: req.body.userEmail,
          error: "Email has been updated!",
        });
      })
      .catch(() =>
        res.send({
          success: false,
          error: "Failed to change email!",
        })
      );
  });

  app.post("/change-password", (req, res) => {
    const query = { _id: new ObjectID(req.body.userId) };
    const values = { $set: { userPassword: req.body.userPassword } };
    db.collection("users")
      .updateOne(query, values)
      .then((result) => {
        res.send({
          success: true,
          userPassword: req.body.userPassword,
          error: "Password has been updated!",
        });
      })
      .catch(() =>
        res.send({
          success: false,
          error: "Failed to change password!",
        })
      );
  });

  app.listen(5000);
});
