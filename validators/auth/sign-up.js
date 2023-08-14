const { body, validationResult } = require('express-validator');
const HTTPErrors = require('http-errors');
const { Pengguna } = require('../../models');

/** @type {Function[]} */
module.exports = [
  body('email')
    .notEmpty()
    .withMessage('Email dibutuhkan')
    .custom((email) => Pengguna.findOne({
      where: { email },
    }).then((pengguna) => (pengguna === null ? Promise.resolve(true) : Promise.reject(new Error('Email terdaftar'))), Promise.reject)),
  body('password')
    .notEmpty()
    .withMessage('Kata Sandi dibutuhkan'),
  body('nama_lengkap')
    .notEmpty()
    .withMessage('Nama Lengkap dibutuhkan'),
  (req, res, next) => (!validationResult(req).isEmpty() ? next(HTTPErrors.BadRequest('validation')) : next()),
];
