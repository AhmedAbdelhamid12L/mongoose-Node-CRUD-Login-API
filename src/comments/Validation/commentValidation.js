const Joi = require("joi");

// Validation where add & Update:

module.exports = {
  validateCommentSchema: {
    body: Joi.object().required().keys({
      comment_content: Joi.string().required(),
      createdBy: Joi.string().required(),
      postId: Joi.string().required()
    }),
  }
};
