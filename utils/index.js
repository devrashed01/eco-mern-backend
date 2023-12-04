const { validationResult } = require("express-validator");

exports.getErrors = (req) => {
  let errors = validationResult(req);
  let errObj = undefined;
  if (!errors.isEmpty()) {
    errObj = {};
    errors.array().forEach((error) => {
      errObj[error.path] = error.msg;
    });
  }
  return errObj;
};
