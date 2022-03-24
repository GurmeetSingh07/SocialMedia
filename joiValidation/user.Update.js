const joi = require("joi");

const userUpdate = joi.object({
  emailId: joi.string().required().email(),
  newPassword: joi.string().required(),
});
module.exports = {
  userUpdate,
};
