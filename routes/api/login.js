// Karan Thakkar[14-07-21] API for user login

// required imports
const express = require("express");
const bcrypt = require("bcrypt");
const { generateToken, authToken } = require("../../middlewares/auth");
const db = require("../../db-init/dbConn");
const router = express.Router();

// POST API for login
// return error code of 400 and a message "All parameters required!" if email, password is not provided in the body
// return error code of 400 and a message "Email not found!" if email provided in the body does not exists in the database
// return error code of 400 and a message "Incorrect password!" if email, password is provided in the body, but the password is wrong
// return success code of 200 and a message "Login Successful" if email,password are in the body and verified from database
router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (Object.keys(req.body).length < 2) {
      return res.status(400).json({
        message: "All parameters required!",
      });
    }
    const userLogin = await db.any(
      `select * from users where email='${email}'`
    );
    if (userLogin.length < 1) {
      return res.status(400).json({
        message: "Email not found!",
      });
    }
    let validatePassword = await bcrypt.compare(
      password,
      userLogin[0].password
    );
    if (validatePassword) {
      let userToken = {
        fname: userLogin[0].fname,
        lname: userLogin[0].lname,
        is_admin: userLogin[0].is_admin,
        email: userLogin[0].email,
      };
      res.status(200).json({
        message: "Login Successful",
        token: generateToken(userToken),
      });
    } else {
      res.status(400).json({
        message: "Incorrect password!",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
