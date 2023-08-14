const { body, validationResult } = require('express-validator');
const HTTPErrors = require('http-errors');

/** @type {Function[]} */
module.exports = [
  body('nama')
    .notEmpty()
    .withMessage('Masukkan nama/brand usaha Anda'),
  body('produk')
    .notEmpty()
    .withMessage('Jelaskan singkat produk Anda'),
  body('detail_usaha')
    .notEmpty()
    .withMessage('Jelaskan detail usaha Anda'),
  body('alamat')
    .notEmpty()
    .withMessage('Masukkan alamat usaha Anda'),
  (req, res, next) => (!validationResult(req).isEmpty() ? next(HTTPErrors.BadRequest('validation')) : next()),
];
