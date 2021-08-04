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

client.connect((error) => {
  console.log("Connected to Mongodb!");
  const db = client.db(dbName);

  //handles images/files storing
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

  //returns general information about the user
  app.get("/get-user-info", (req, res) => {
    console.log("info: " + JSON.stringify(req.query));
    db.collection("users")
      .findOne(req.query.userId)
      .then((result) => {
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

  //Checks if the user login info matches any account in the database
  app.post("/login", (req, res) => {
    console.log("login: " + JSON.stringify(req.body));
    db.collection("users")
      .findOne(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch(() => console.log("Failed to send"));
  });

  //Creates an account in the database
  app.post("/sign-up", (req, res) => {
    db.collection("users")
      .insertOne(req.body)
      .then(() => res.send(true))
      .catch(() => res.send(false));
  });

  //handles add item request
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

    //updates/pushes item into user cart
    db.collection("users")
      .updateOne(query, values)
      .catch((e) => console.log(e));

    //returns updated user cart
    db.collection("users")
      .findOne(query)
      .then((result) => {
        console.log(result);
        res.send(result.userCart);
      })
      .catch((e) => console.log(e));
  });


  //Handles deleting item from user cart
  app.post("/remove-item", (req, res) => {
    const query = { _id: new ObjectID(req.body.userId) };
    const values = { $pull: { userCart: { itemId: req.body.itemId } } };
    console.log("remove: " + JSON.stringify(req.body));

    //Updates user cart
    db.collection("users")
      .updateOne(query, values)
      .catch((e) => console.log(e));

    //returns updated user cart
    db.collection("users")
      .findOne(query)
      .then((result) => {
        console.log(result);
        res.send(result.userCart);
      })
      .catch((e) => console.log(e));
  });

  //handles decreasing item quantity
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
        //returns updated user cart
        db.collection("users")
          .findOne({ _id: new ObjectID(req.body.userId) })
          .then((result2) => {
            res.send(result2.userCart);
          });
      })
      .catch((e) => console.log(e));
  });

  //handles increasing item quantity
  app.post("/cart-item-increase-qty", (req, res) => {
    console.log("add qty: " + JSON.stringify(req.body));
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
      .then((result) => {
        //returns updated user cart
        db.collection("users")
          .findOne({ _id: new ObjectID(req.body.userId) })
          .then((result2) => {
            console.log(result2);
            res.send(result2.userCart);
          });
      })
      .catch((e) => console.log(e));
  });

  //Returns user cart
  app.get("/get-my-cart", (req, res) => {
    console.log("my cart : " + JSON.stringify(req.query));
    db.collection("users")
      .findOne({ _id: new ObjectID(req.query.userId) })
      .then((result) => {
        res.send(result.userCart);
      });
  });

  //Returns user orders
  app.get("/get-my-orders", (req, res) => {
    db.collection("orders")
      .find(req.query.userId)
      .toArray()
      .then((result) => {
        res.send(result);
      })
      .catch((e) => console.log(e));
  });

  //Returns all items in the database
  app.get("/get-all-items", (req, res) => {
    db.collection("products")
      .find({})
      .toArray()
      .then((result) => {
        res.send(result);
      })
      .catch((e) => console.log(e));
  });

  //Handles create new orders
  app.post("/create-orders", (req, res) => {
    //Creates a record of the order
    db.collection("orders")
      .insertOne(req.body)
      .then((result)=>{
        //Clears user cart
        db.collection("users")
        .updateOne(
          { _id: new ObjectID(req.body.userId) },
          { $set: { userCart: [] } }
        )
        .then((result) => {
          res.send([]);
        })
        .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  });

  //Handles create new post/product
  app.post("/create-post", (req, res) => {
    console.log("post: " + JSON.stringify(req.body));
    db.collection("products")
      .insertOne(req.body)
      .then(() => {
        res.send({
          success: true,
          error: "Your post has been submitted!",
        })
      })
      .catch((e) => console.log(e));
  });

  //Returns user posts
  app.get("/get-my-post", (req, res) => {
    console.log("post: " + JSON.stringify(req.query));
    db.collection("products")
      .find({creator_id: req.query.userId})
      .toArray()
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((e) => console.log(e));
  });

  //Handles user profile picture changing
  app.post("/change-profile", (req, res) => {
    if (req.files === null) {
      res.send({
        success: false,
        error: "File not found!",
      });
    } else {
      const file = req.files.file;
      //Stores user profile pictures into the database
      file.mv(`../public/${file.name}`, (err) => {
        if (err) {
          console.error(err);
        } else {
          const query = { _id: new ObjectID(req.query.userId) };
          const values = { $set: { userProfile: file.name } };
          //Finds user previous profile picture and delete it from the database
          db.collection("users")
            .findOne(req.files.userId)
            .then((result) => {
              const fileName = result.userProfile;
              if (fileName !== "default-profile.png") {
                try {
                  fs.unlinkSync(`../public/${fileName}`);
                  console.log("successfully deleted");
                } catch (err) {
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

  //Handles username changing
  app.post("/change-username", (req, res) => {
    const query = { _id: new ObjectID(req.body.userId) };
    const values = { $set: { username: req.body.username } };
    db.collection("users")
      .updateOne(query, values)
      .then((result) => {
        res.send({
          success: true,
          username: req.body.username,
          error: "Username has been updated!",
        });
      })
      .catch(() =>
        res.send({
          success: false,
          error: "Failed to change username!",
        })
      );
  });

  //Handles user email changing
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

  //Handles password changing
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
