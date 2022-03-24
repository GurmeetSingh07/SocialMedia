const joi = require("joi");

const Update = joi.object({
  emailId: joi.string().required().email(),
  newPassword: joi.string().required(),
});
module.exports = {
  Update,
};
