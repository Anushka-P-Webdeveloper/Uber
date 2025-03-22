const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blackListToken.model");

///Registers a user
module.exports.registerUser = async (req, res, next) => {
  const error = validationResult(req);
  console.log(req.body);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  const { fullName, email, password } = req.body;
  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashPassword,
  });

  const token = user.generateAuthToken();
  res.status(201).json({ token, user });
};

///User login
module.exports.loginUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isMatchPassword = await user.comparePassword(password);
  if (!isMatchPassword) {
    return res.status(401).json({ message: "Password Doesn't Match" });
  }
  const token = user.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ token, user, msg: "Login successful" });
};

//get user profile

module.exports.getUserProfile = async function (req, res, next) {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async function (req, res, next) {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blackListTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};
