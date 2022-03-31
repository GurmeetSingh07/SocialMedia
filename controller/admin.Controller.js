const Model = require("../models/user.Schema");
const mailservice = require("../helper/mailservice");
const demo = require("../helper/mailservice");
const { Schema } = require("../joiValidation/joi.user");
const { Update } = require("../joiValidation/user.Update");
const { reset } = require("../joiValidation/user.Reset");

const redis = require("redis");
const client = redis.createClient({
  legacyMode: true,
});

client.connect();
var dataForget = {};

// const globalData = {};

class Admincontoller {
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
          .json({ message: "Admin Already Exist", success: false });
      } else {
        const globalData = {};

        globalData[`${emailId}`] = Math.floor(Math.random() * 99999);
        globalData["fName"] = fName;
        globalData["lName"] = lName;
        globalData["emailId"] = emailId;
        globalData["password"] = password;
        globalData["role"] = `${"user"}`;
        // console.log(globalData);

        client.setEx("global", 60, JSON.stringify(globalData));

        await rabbitMqnodemailer.rabbit(globalData, emailId);
        return res.json({
          message: "email successfully sent",
          globalData: globalData[`${emailId}`],
          success: true,
        });
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
      client.get("global", async (err, result) => {
        if (err) {
          throw err;
        } else {
          // console.log(result);
          let redisData = JSON.parse(result);

          if (redisData === null) {
            return res.status(400).json({
              message: "to late for otp verify sign back",
              success: false,
            });
          }

          const { fName, lName, emailId, password, role } = redisData;
          const { otp } = req.body;

          if (!otp) {
            return res
              .status(400)
              .json({ message: "please fill the otp", success: false });
          }

          // let oldOtp = JSON.stringify(globalData.otp);
          let oldOtp = redisData[`${emailId}`];

          if (otp == oldOtp) {
            const adminSave = new Model({
              fName,
              lName,
              emailId,
              password,
              role,
            });

            const result = await adminSave.save();
            return res
              .status(200)
              .json({ message: "Admin save", success: true });
          } else if (otp != oldOtp) {
            return res
              .status(400)
              .json({ message: "you entered the wrong OTP", success: false });
          }
        }
      });
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
          .json({ message: "email not found", success: false });
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
        return res.status(200).json({ message: "admin update", success: true });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, success: true });
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
        dataForget["otp"] = Math.floor(Math.random() * 999999);
        // console.log(globalData);

        await rabbitMqnodemailer.rabbit(dataForget, emailId);

        return res.status(200).json({
          message: "email send seccessfully",
          globalData: dataForget[`${emailId}`],
          success: true,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, success: false });
    }
  };
  reset = async (req, res) => {
    try {
      // let oldOtp = JSON.stringify(globalData.otp);

      const { emailId, otp, newPassword } = req.body;
      let oldOtp = dataForget[`${emailId}`];
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
      } else if (emailId === resetEmail.emailId && otp == oldOtp) {
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
}

module.exports = new Admincontoller();
