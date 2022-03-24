const joi = require("joi");

const login = joi.object({
  emailId: joi.string().required().email(),
  password: joi.string().required(),
});
module.exports = {
  login,
};
