const { validationResult } = require("express-validator");

exports.getErrors = (req) => {
  let errors = validationResult(req);
  const errObj = undefined;
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      errObj[error.path] = error.msg;
    });
  }
  return errObj;
};
