const {Joi, celebrate} = require("celebrate")

module.exports.validateUserBody = celebrate({
    body: Joi.object().keys({
        username: Joi.string().required().min(2).max(30).messages({
            "string.min": 'The minimum length of the "name" field is 2',
            "string.max": 'The maximum length of the "name" field is 30',
            "string.empty": 'The "name" field must be filled in',
          }),
          password: Joi.string().required().messages({
            "string.empty": 'The "password" field must be filled in',
          }),
    })
})

module.exports.validateLogIn = celebrate({
    body: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      password: Joi.string().required().messages({
        "string.empty": 'The "password" field must be filled in',
    }),
})