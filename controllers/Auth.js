const bcrypt = require("bcrypt");
const User = require("../models/user");
const { response } = require("express");

// signup routes handler

exports.signup = async (req, res) => {
  try {
    // get data
    const { name, email, password, roles } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "error in hashing password",
      });
    }

    // create entry for user

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roles,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "User not created !!",
    });
  }
};
