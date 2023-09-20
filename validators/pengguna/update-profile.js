const fs = require('node:fs');
const mime = require('mime');
const { body, validationResult } = require('express-validator');
const HTTPErrors = require('http-errors');
const { Pengguna } = require('../../models');

const validateUsername = async (value, { req }) => {
  if (value) {
    const validate = await Pengguna.findOne({ select: ['id', 'username'], where: { username: value } }).then((pengguna) => {
      if (pengguna === null) {
        return true;
      }

      if (pengguna.id !== req.user) {
        return Promise.reject(new Error('Username sudah digunakan'));
      }

      return true;
    }, (error) => Promise.reject(error));

    return validate;
  }

  return true;
};

/** @type {Function[]} */
module.exports = [
  body('email')
    .isEmail()
    .withMessage('Format email tidak valid')
    .custom((email, { req }) => Pengguna.findOne({ select: ['id', 'email'], where: { email } }).then((pengguna) => {
      if (pengguna === null) {
        return Promise.resolve(true);
      }

      if (pengguna.id !== req.user) {
        return Promise.reject(new Error('Email sudah digunakan'));
      }

      return true;
    }, Promise.reject)),
  body('username')
    .if(body('username').notEmpty())
    .custom(validateUsername),
  body('foto_profil')
    .custom((value, { req }) => {
      if (req.file) {
        const fileExt = mime.getExtension(req.file.mimetype);
        const imageExtensions = ['jpg', 'jpeg', 'png'];

        if (req.file) {
          if (imageExtensions.indexOf(fileExt) !== -1) {
            fs.renameSync(req.file.path, `${req.file.path}.${fileExt}`);
            req.file.filename = `${req.file.filename}.${fileExt}`;
            return true;
          }

          fs.rmSync(req.file.path);
          throw new Error('File harus berupa gambar');
        }
      }

      return true;
    }),
  (req, res, next) => {
    console.log(req.headers);
    return next();
  },
  (req, res, next) => (!validationResult(req).isEmpty() ? next(HTTPErrors.BadRequest('validation')) : next()),
];
