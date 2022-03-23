const { strict } = require("jade/lib/doctypes");
const mongoose = require("../database/connection");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    require: true,
  },

  lName: {
    type: String,
    require: true,
  },
  emailId: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  friendRequest: [],
  friendList: [],
  role: {
    type: String,
  },
});

module.exports = mongoose.model("Model", userSchema);
