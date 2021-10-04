// Karan Thakkar[14-07-21] API for user sign up

// required imports
const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const { generateToken, authToken } = require("../../middlewares/auth");
const db = require("../../db-init/dbConn");

// POST API for sign up
// return error code of 400 and a message "All parameters required!" if email,fname,lname,phone_no,is_admin, password any one of them is not provided in the body
// return error code of 400 and a message "Email already in use!" if email provided in the body already exists in the database
// return success code of 200 and a message "sign up successful" if all parameters are provided in the body
router.post("/", async (req, res, next) => {
  try {
    const { email, fname, lname, phoneNo, isAdmin, password } = req.body;
    if (Object.keys(req.body).length < 6) {
      return res.status(400).json({
        message: "All parameters required!",
      });
    }
    const user = await db.any(`select * from users where email='${email}'`);
    if (user.length > 0) {
      return res.status(400).json({
        message: "Email already in use!",
      });
    }
    // create hashed password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.any(
      `insert into users(email,fname,lname,phone_no,password,is_admin) values('${email}','${fname}','${lname}',${phoneNo},'${hashedPassword}',${isAdmin})`
    );
    return res.status(200).json({
      message: "sign up successful",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
