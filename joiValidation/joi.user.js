const joi = require("joi");

const userSchema = joi.object({
  fName: joi.string().required(),
  lName: joi.string().required(),
  emailId: joi.string().required().email(),
  password: joi.string().required(),
});
module.exports = {
  userSchema,
};
