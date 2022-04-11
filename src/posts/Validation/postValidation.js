const Joi = require("joi");

// Validation where add & Update:

module.exports = {
  validatePostSchema: {
    body: Joi.object().required().keys({
      post_content: Joi.string().required(),
      createdBy: Joi.string(),
      // commentsIds: Joi.string().required()
    }),
  }
};