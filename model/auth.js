const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const salt = "$myboy"
var jwt = require('jsonwebtoken');;
const {
  body,
  validationResult
} = require('express-validator');
let success = false;
//localhost:4000/api/auth/signup
try {
  router.post("/signup",
    body('email', "invalid email").isEmail(),
    body('password', "invalid password").isLength({
      min: 6
    }),
    body('name', "invalid username").isLength({
      min: 3
    }),
    body('phone', "invalid phone number").isLength({
      min: 10,
      max: 10
    }), async (req, res)=> {
      //checking validationResult

      console.log(req.body)

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          success: false
        });
      }

      // checking if user exist the  return bad  request
      let checkUser = await User.findOne({
        email: req.body.email
      })


      if (checkUser) {
        res.status(400).json({
          err: "invalid access",
          success: false
        })
      } else {
        //password hashing , creating user and saving into database
        try {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, async function(err, hash) {
              // Store hash in your password DB.
              let user = await User.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hash,
              })

              let data = {
                user: {
                  id: user.id
                }
              }
              let token = jwt.sign(data, "iamaman");
              res.status(200).json({
                token, success: true
              })
            });
          });
        }catch(e) {
          res.status(500).json({
            err: "internal server error", success: false
          })
        }
      }
    });
}catch(err) {
  res.status(500).json({
    err
  })
}
//localhost:4000/api/auth/login

router.post("/login",
  body('email', "invalid email").isEmail(),
  body('password', "invalid password").isLength({
    min: 6
  }),
  async (req, res)=> {
    //checking validationResult
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      email,
      password
    } = req.body;
    let user = await User.findOne({
      email
    })
    if (!user) {
      return res.status(401).json({
        err: "Unauthorized access"
      });
    }

    let checkPass = await bcrypt.compare(password, user.password)
    if (!checkPass) {
      return res.status(401).json({
        err: "Unauthorized access"
      })
    }
    let data = {
      user: {
        id: user.id
      }
    }
    let token = jwt.sign(data, "iamaman");
    res.status(200).json(token)
    console.log(token)
  })
module.exports = router;