const Model = require("../models/user.Schema");

const { Schema } = require("../joiValidation/joi.user");
const { requestApproved } = require("../joiValidation/request.Approved");
const { userRequest } = require("../joiValidation/user.Request");
const { Update } = require("../joiValidation/user.Update");
const { reset } = require("../joiValidation/user.Reset");
const mailservice = require("../helper/mailservice");
const demo = require("../helper/mailservice");

const globalData = {};

class Usercontoller {
  signUp = async (req, res) => {
    try {
      const { fName, lName, emailId, password } = req.body;

      const results = Schema.validate(req.body);
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
        return res
          .status(200)
          .json({ message: "email successfully sent", success: true });
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
        return res
          .status(200)
          .json({ message: "User Successfully Register", success: true });
      } else if (otp != oldOtp) {
        return res
          .status(400)
          .json({ message: "you entered the wrong OTP", success: false });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, success: false });
    }
  };

  update = async (req, res) => {
    try {
      const { emailId, newPassword } = req.body;
      const results = Update.validate(req.body);
      if (results.error) {
        return res
          .status(206)
          .json({ message: results.error.message, success: false });
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

      if (!emailId) {
        return res
          .status(206)
          .json({ message: "Please fill the field", success: false });
      }
      const userForgot = await Model.findOne({ emailId: emailId });

      if (!userForgot) {
        return res
          .status(404)
          .json({ message: "invalid  emailId ", success: false });
      } else {
        globalData["otp"] = Math.floor(Math.random() * 999999);

        await mailservice(globalData, emailId);

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
      const results = reset.validate(req.body);
      if (results.error) {
        return res
          .status(206)
          .json({ message: results.error.message, success: false });
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
      const results = userRequest.validate(req.body);
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
        if (userExist.friendRequest[key] === requestSender) {
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

  requestApproved = async (req, res) => {
    try {
      const { requestDetails, requestReciver } = req.body;
      const results = requestApproved.validate(req.body);
      if (results.error) {
        return res
          .status(206)
          .json({ message: results.error.message, success: false });
      }

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
