const Joi = require("joi");

// Validation where add(signUp) & Update:

const validateUserSchema = {
  body: Joi.object().required().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    age: Joi.number().required(),
    password: Joi.string()
      .pattern(new RegExp('^.{8,12}$'))
      .required(),
    address: Joi.string().required(),
    userImage: Joi.string(),
    role: Joi.string().required(),
    })
  };

const validatelogin = {
  body: Joi.object().required().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .pattern(new RegExp('^.{8,12}$'))
      .required(),
    })
  };

module.exports = {
  validateUserSchema,
  validatelogin
}