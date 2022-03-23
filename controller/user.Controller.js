const { model } = require("../database/connection");
const Model = require("../models/user.Schema");
const { userSchema } = require("../joiValidation/joi.user");
const { request } = require("../joiValidation/user.Request");
class Usercontoller {
  signUp = async (req, res) => {
    try {
      const { fName, lName, emailId, password } = req.body;

      const results = userSchema.validate(req.body);
      if (results.error) {
        return res
          .status(206)
          .json({ message: results.error.message, success: false });
      }
      const userExist = await Model.findOne({ emailId: emailId });

      if (userExist) {
        return res
          .status(409)
          .json({ message: "User Already Exist", success: false });
      } else {
        const adding = new Model({
          fName,
          lName,
          emailId,
          password,
          role: "admin",
        });
        const result = await adding.save();
        return res
          .status(200)
          .json({ message: "user successfully register", success: true });
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json(e, { message: "server error", success: false });
    }
  };

  friendRequest = async (req, res) => {
    try {
      const { requestReciver, requestSender } = req.body;
      const results = request.validate(req.body);
      if (results.error) {
        return res
          .status(206)
          .json({ message: results.error.message, success: false });
      }

      const userExist = await Model.findOne({
        _id: requestReciver,
      });

      if (!userExist) {
        return res
          .status(404)
          .json({ message: "User Not Found", success: false });
      }

      for (const key in userExist.friendRequest) {
        if (userExist.friendRequest[key] === requestReciver) {
          return res.status(400).json({
            message: "you have already send the request",
            success: true,
          });
        }
      }
      if (true) {
        const requestResult = await Model.findByIdAndUpdate(
          { _id: requestReciver },
          {
            $push: {
              friendRequest: requestReciver,
            },
          },
          {
            set: true,
          }
        );
        return res
          .status(200)
          .json({ message: "Request successfully send", success: true });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "server Error", success: false });
    }
  };
}

module.exports = new Usercontoller();
