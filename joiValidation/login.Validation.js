const joi = require("joi");

const userlogin = joi.object({
  emailId: joi.string().required().email(),
  password: joi.string().required(),
});
module.exports = {
  userlogin,
};
