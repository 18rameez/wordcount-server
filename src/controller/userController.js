const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../schema/user");
require('dotenv').config();

exports.signUp = (req,res,next) => {
   

    const { error } = userSchema.validate(req.body);

    if (!error) {

      const secretKey = process.env.JWT_SECRET_KEY
      const { name, email, password } = req.body;

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else {
          const user = new User(name, email, hash);
          user
            .create()
            .then((result) => {
              const userPayload = {
                name: req.body.name,
                email: req.body.email,
                userId: result.insertedId,
              };
             
              const token = jwt.sign(userPayload, secretKey, { expiresIn: "10d" });
              res.cookie("token", token);
              res.status(201).json({
                message: "User created successfully",
                token: token,
              });
            })
            .catch((err) => {
                console.log(err);
              res.status(500).json({ error: err });
            });
        }
      });
    } else {
      res.status(400).send({ error: "Invalid Parameter" });
    }

}

exports.login = (req, res, next) => {
     
  const { email, password } = req.body;

  const secretKey = process.env.JWT_SECRET_KEY

  if (email === undefined || password === undefined) {
    return res.status(400).json({ message: "Invalid Parameter" });
  } else {
    User.getUser(email)
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({
              message: "Authentication failed",
              details: "No user found",
            });
        }
        bcrypt.compare(password, user.password, (err, result) => {
          console.log(result);
          if (err) {
            return res.status(401).json({ message: "Incorrect Password" });
          }
          if (result) {
            const token = jwt.sign(
              { email: user.email, userId: user._id, apikey: user.apikey },
              secretKey,
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
            });
          }
          return res.status(401).json({ message: "Authentication Error" });
        });
      })
      .catch((err) => {
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
   
}