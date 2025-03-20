const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "Min Length MUST be at least 3 characters Long"],
    },
    lastName: {
      type: String,
      minlength: [3, "Min Length MUST be at least 3 characters Long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Min Length MUST be at least 5 characters Long"],
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  socketId: {
    type: String,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
