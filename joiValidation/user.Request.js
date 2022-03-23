const joi = require("joi");

const userSchema = joi.object({
  requestReciver: joi.string().required(),
  requestSender: joi.string().required(),
});
module.exports = {
  userSchema,
};
