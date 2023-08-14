const { body, validationResult } = require('express-validator');
const HTTPErrors = require('http-errors');

/** @type {Function[]} */
module.exports = [
  body('identity')
    .notEmpty()
    .withMessage('Email / Username dibutuhkan')
    .bail(),
  body('password')
    .notEmpty()
    .withMessage('Kata Sandi dibutuhkan')
    .bail(),
  (req, res, next) => (!validationResult(req).isEmpty() ? next(HTTPErrors.BadRequest('validation')) : next()),
];
