const joi = require("joi");

const userRequest = joi.object({
  requestReciver: joi.string().required(),
  requestSender: joi.string().required(),
});
module.exports = { userRequest };
