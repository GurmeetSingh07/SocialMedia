const { model } = require("../database/connection");
const { findByIdAndUpdate } = require("../models/user.Schema");
const Model = require("../models/user.Schema");

class Usercontoller {
  signUp = async (req, res) => {
    try {
      const { fName, lName, emailId, password } = req.body;

      if (!fName || !lName || !emailId || !password) {
        return res
          .status(206)
          .json({ message: "please fill the field", success: false });
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
      const { requestReciver, requestSender, userName } = req.body;

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

      const requestResult = await Model.findByIdAndUpdate(
        { _id: requestReciver },
        {
          $push: {
            friendRequest: requestSender,
          },
        },
        {
          set: true,
        }
      );
      return res
        .status(200)
        .json({ message: "Request successfully send", success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "server Error", success: false });
    }
  };

  requestApprove = async (req, res) => {
    try {
      const { requestDetails, requestReciver } = req.body;
      const requestResult = await Model.findByIdAndUpdate(
        { _id: requestReciver },
        {
          $pull: {
            friendRequest: requestDetails,
          },
        },
        {
          set: true,
        }
      );

      const friendListResult = await Model.findByIdAndUpdate(
        { _id: requestReciver },
        {
          $push: {
            friendList: requestDetails,
          },
        },
        {
          set: true,
        }
      );
      console.log(friendListResult);
      return res
        .status(200)
        .json({ message: "Request successfully accepted", success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Sever Error", success: true });
    }
  };
}

module.exports = new Usercontoller();
