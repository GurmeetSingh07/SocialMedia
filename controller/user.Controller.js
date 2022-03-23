const { model } = require("../database/connection");
const { findByIdAndUpdate } = require("../models/user.Schema");
const Model = require("../models/user.Schema");

const { userSchema } = require("../joiValidation/joi.user");
const { request } = require("../joiValidation/user.Request");

const mailservice = require("../helper/mailservice");
const demo = require("../helper/mailservice");
const { model } = require("../database/connection");
const globalData = {};


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
        globalData["otp"] = Math.floor(Math.random() * 99999);
        globalData["fName"] = fName;
        globalData["lName"] = lName;
        globalData["emailId"] = emailId;
        globalData["password"] = password;
        globalData["role"] = `${"user"}`;

        console.log(globalData);

        await mailservice(globalData, emailId);
        return res.json({ message: "email successfully sent", success: true });
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json(e, { message: "server error", success: false });
    }
  };

  signUpVerify = async (req, res) => {
    try {
      const { fName, lName, emailId, password, role } = globalData;
      const { otp } = req.body;

      if (!otp) {
        return res
          .status(400)
          .json({ message: "please fill the otp", success: false });
      }

      let oldOtp = JSON.stringify(globalData.otp);

      if (otp === oldOtp) {
        const userSave = new Model({
          fName,
          lName,
          emailId,
          password,
          role,
        });

        const result = await userSave.save();
        return res.status(200).json({ message: "user save", success: true });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, success: false });
    }
  };

  update = async (req, res) => {
    try {
      const { emailId, newPassword } = req.body;
      if (!emailId || !newPassword) {
        return res
          .status(400)
          .json({ message: "fill the field", success: true });
      }

      const userFind = await Model.findOne({ emailId: emailId });

      if (!userFind) {
        return res
          .status(404)
          .json({ message: " email not found", success: false });
      } else if (userFind.password === newPassword) {
        return res
          .status(400)
          .json({ message: "you enter the old password", success: false });
      } else {
        const id = userFind._id;

        const newUpdate = await Model.findByIdAndUpdate(
          { _id: id },
          { password: newPassword },
          { new: true }
        );
        return res.status(200).json({ message: "user update", success: true });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, success: false });
    }
  };

  forget = async (req, res) => {
    try {
      const { emailId } = req.body;
      console.log(req.body);

      if (!emailId) {
        return res
          .status(404)
          .json({ message: "fill the field", success: false });
      }
      const userForgot = await Model.findOne({ emailId: emailId });

      if (!userForgot) {
        return res
          .status(404)
          .json({ message: "invalid  emailId ", success: false });
      } else {
        globalData["otp"] = Math.floor(Math.random() * 999999);
        console.log(globalData);

        await demo(globalData, emailId);

        return res
          .status(200)
          .json({ message: "email send seccessfully", success: true });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, success: false });
    }
  };
  reset = async (req, res) => {
    try {
      let oldOtp = JSON.stringify(globalData.otp);

      const { emailId, otp, newPassword } = req.body;
      console.log(req.body);

      if (!emailId || !otp || !newPassword) {
        return res
          .status(400)
          .json({ message: "fill the field", success: false });
      }

      const resetEmail = await Model.findOne({ emailId: emailId });

      if (!resetEmail) {
        return res
          .status()
          .json({ message: "invalid  EmailID ", success: false });
      } else if (emailId === resetEmail.emailId && otp === oldOtp) {
        const id = resetEmail._id;
        const userUpdate = await Model.findByIdAndUpdate(
          { _id: id },
          { password: newPassword },
          { new: true }
        );

        return res
          .status(200)
          .json({ message: "password reset successfully", success: true });
      } else {
        return res
          .status(404)
          .json({ message: "invalid credentials", success: false });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, success: false });
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
