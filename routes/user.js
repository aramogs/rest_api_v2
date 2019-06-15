const express = require("express");
const router = express.Router();
const User = require("../models").User;
const authenticate = require("../configurations/authenticate");
const bcryptjs = require("bcryptjs");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Create the user routes
// Set up the following routes (listed in the format HTTP METHOD Route HTTP Status Code):
// GET /api/users 200 - Returns the currently authenticated user
// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

router.get("/", authenticate, (req, res) => {
  res.status(200);
  //Sendind the user information once authenticated
  res.json({
    id: req.currentUser.id,
    fullName: req.currentUser.firstName + " " + req.currentUser.lastName,
    firstName: req.currentUser.firstName,
    lastName: req.currentUser.lastName,
    emailAddress: req.currentUser.emailAddress,
  });
});

//Route to create a new user
router.post("/", (req, res) => {
  User.findOne({ where: { emailAddress: req.body.emailAddress } })
    .then(user => {
      //If the email is not found then:
      if (!user) {
        req.body.password = bcryptjs.hashSync(req.body.password);
        User.create(req.body)
          .then(() => {
            res
              .location("/users")
              .status(200)
              .json({
                message: " User created!",
                Fullname: req.body.firstName+' '+req.body.lastName,
                FirstName: req.body.firstName,
                lastName: req.body.lastName,
                emailAddress: req.body.emailAddress
              });
          })
          .catch(err => {
            res.status(500).json({ Error: err });
          });
      } else {
        res.status(400).json({ Message: "User previously registered" });
      }
    })
    .catch(err => {
      err = "Missing information";
      res
        .status(400)
        .json({ Error: "Please fill the required Information",err});
    });
});
module.exports = router;
