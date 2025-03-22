const mongoose = require("mongoose");
const blackListTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
  },
  {
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 24 * 60 * 60 * 1000,
    },
  }
);

blackListTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const BlackListToken = mongoose.model("BlackListToken", blackListTokenSchema);
module.exports = BlackListToken;
