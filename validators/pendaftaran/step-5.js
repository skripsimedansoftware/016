const { body, validationResult } = require('express-validator');
const HTTPErrors = require('http-errors');

/** @type {Function[]} */
module.exports = [
  body('latitude').notEmpty().withMessage('Latitude'),
  body('longitude').notEmpty().withMessage('Longitude'),
  (req, res, next) => (!validationResult(req).isEmpty() ? next(HTTPErrors.BadRequest('validation')) : next()),
];
