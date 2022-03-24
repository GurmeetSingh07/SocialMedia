const joi = require("joi");

const userReset = joi.object({
  emailId: joi.string().required().email(),
  otp: joi.string().required(),
  newPassword: joi.string().required(),
});
module.exports = {
  userReset,
};
