const mongoose = require("mongoose");

const tempUserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
    },
    password: {
      type: String,
      required: [true, "Password can't be empty"],
    },
    username: {
      type: String,
      required: [true, "Please enter codeforces username"],
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TempUser = mongoose.model("TempUser", tempUserSchema);
module.exports = {
  TempUser,
  userSchema: tempUserSchema,
};
