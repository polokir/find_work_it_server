const HttpError = require('../errors/errorHandler');


const validateBody = (schema) =>{
    const func = (req, _, next) => {
        const { body } = req;
        const { error } = schema.validate(body);
        const filledBody = Object.keys(body).length;
    
        if (!filledBody) {
          next(HttpError(400, "missing  fields"));
        } else if (error) {
          next(
              HttpError(
              400,
              `missing required ${error.message.slice(
                1,
                error.message.lastIndexOf('"')
              )} field`
            )
          );
        }
        next(error);
      };
      return func;
}

module.exports = validateBody;