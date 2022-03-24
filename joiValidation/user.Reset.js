const joi = require("joi");

const reset = joi.object({
  emailId: joi.string().required().email(),
  otp: joi.string().required(),
  newPassword: joi.string().required(),
});
module.exports = { reset };
