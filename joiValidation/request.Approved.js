const joi = require("joi");

const requestApproved = joi.object({
  requestDetails: joi.string().required(),
  requestReciver: joi.string().required(),
});
module.exports = { requestApproved };
