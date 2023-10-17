const Joi = require("joi");

const emailRegEx =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d].{8,30}$/;

const registerValidationRecruiter = Joi.object(
  {
    name: Joi.string().max(20),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(passwordRegEx)
      .required()
      .messages({
        "string.pattern.base":
          "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
        "string.min": "Password shoud be at least 8 characters",
        "string.max": "Password shoul be less than 30 characters",
      }),
    email: Joi.string().pattern(emailRegEx).required(),

    company_name: Joi.string().required().messages({
      "any.required": "Company name is required",
    }),

    avatarURL: Joi.string(),
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const registerValidationEmployee = Joi.object({
  name: Joi.string(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(passwordRegEx)
    .required()
    .messages({
      "string.pattern.base":
        "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
      "string.min": "Password shoud be at least 8 characters",
      "string.max": "Password shoul be less than 30 characters",
    }),
  email: Joi.string().pattern(emailRegEx).required(),

  avatarURL: Joi.string(),

  age: Joi.number().required().messages({
    "any.required": "Age is required",
    "number.base": "Age must be a number",
  }),

  experience: Joi.number().required().default(0).messages({
    "any.required": "Experience is required",
    "number.base": "Experience must be a number",
  }),

  skills: Joi.array().items(Joi.string()),

  salary_level: Joi.number(),

  resumeUrl: Joi.string(),
});

const loginValidation = Joi.object(
  {
    password: Joi.string().min(8).required(),
    email: Joi.string().pattern(emailRegEx).required().messages({
      "string.pattern.base": "You have misprint in your email",
    }),
  },
  {
    versionKey: false,
    timestamps: true,
  }
);



module.exports = { registerValidationEmployee, registerValidationRecruiter,loginValidation };
