const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  const { fullName, email, password } = req.body;
  const hashPassword = await userModel.hashPassword(password);

  const newUser = await userService.createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashPassword,
  });
  const token = newUser.generateAuthToken();
  res.status(200).json({ token, newUser });
};
