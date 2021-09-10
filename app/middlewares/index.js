const Joi = require("joi");
const statusCode = require("../constants/statusCode");
const { errorMessages } = require("../constants/messages");

const validateRequest = (req, res, next, schema) => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    return res.status(statusCode.BadRequest).send({
      error: true,
      message: `Validation error: ${error.details
        .map((x) => x.message)
        .join(", ")}`,
    });
  } else {
    req.body = value;
    next();
  }
};

const productsSchema = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().required(),
    inventory: Joi.number().integer().required(),
    size: Joi.string().max(3),
    gender: Joi.string(),
  }).required();

  validateRequest(req, res, next, schema);
};

const productsToUpdateSchema = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    value: Joi.number(),
    inventory: Joi.number().integer(),
    size: Joi.string().max(3),
    gender: Joi.string(),
  })
    .required()
    .min(1);

  validateRequest(req, res, next, schema);
};

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (_error, _req, res, _next) => {
  console.log(errorMessages.serverError, _error);

  return res.status(statusCode.InternalServerError).send({
    error: true,
    message: errorMessages.internalError,
  });
};

module.exports = {
  productsSchema,
  errorMiddleware,
  productsToUpdateSchema,
};
