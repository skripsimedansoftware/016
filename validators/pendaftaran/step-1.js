const fs = require('node:fs');
const mime = require('mime');
const { body, validationResult } = require('express-validator');
const HTTPErrors = require('http-errors');
const { Pengguna } = require('../../models');

/** @type {Function[]} */
module.exports = [
  body('nik')
    .isInt({ allow_leading_zeroes: false })
    .withMessage('NIK tidak valid').bail()
    .custom((nik, { req }) => {
      if (nik) {
        return Pengguna.findOne({ select: ['id', 'nik'], where: { nik } }).then((pengguna) => {
          if (pengguna === null) {
            return true;
          }

          if (pengguna.id !== req.user) {
            throw new Error('NIK telah didaftarkan');
          }

          return true;
        });
      }

      return false;
    })
    .withMessage('NIK tidak valid')
    .bail(),
  body('nomor_hp')
    .notEmpty().withMessage('Nomor HP wajib diisi').bail(),
  body('fotocopy_kk')
    .custom((_value, { req }) => {
      const imageExtensions = ['jpg', 'jpeg', 'png'];

      if (req.files?.fotocopy_kk) {
        const fileExt = mime.getExtension(req.files.fotocopy_kk[0].mimetype);
        if (imageExtensions.indexOf(fileExt) !== -1) {
          fs.renameSync(req.files.fotocopy_kk[0].path, `${req.files.fotocopy_kk[0].path}.${fileExt}`);
          req.files.fotocopy_kk[0].filename = `${req.files.fotocopy_kk[0].filename}.${fileExt}`;
          return true;
        }

        fs.rmSync(req.files.fotocopy_kk[0].path);
        throw new Error('File harus berupa gambar');
      }

      throw new Error('Pilih berkas fotocopy KK Anda');
    }).bail(),
  body('fotocopy_ktp')
    .custom((_value, { req }) => {
      const imageExtensions = ['jpg', 'jpeg', 'png'];

      if (req.files?.fotocopy_ktp) {
        const fileExt = mime.getExtension(req.files.fotocopy_ktp[0].mimetype);
        if (imageExtensions.indexOf(fileExt) !== -1) {
          fs.renameSync(req.files.fotocopy_ktp[0].path, `${req.files.fotocopy_ktp[0].path}.${fileExt}`);
          req.files.fotocopy_ktp[0].filename = `${req.files.fotocopy_ktp[0].filename}.${fileExt}`;
          return true;
        }

        fs.rmSync(req.files.fotocopy_ktp[0].path);
        throw new Error('File harus berupa gambar');
      }

      throw new Error('Pilih berkas fotocopy KTP Anda');
    }).bail(),
  body('fotocopy_npwp')
    .custom((_value, { req }) => {
      const imageExtensions = ['jpg', 'jpeg', 'png'];

      if (req.files?.fotocopy_npwp) {
        const fileExt = mime.getExtension(req.files.fotocopy_npwp[0].mimetype);
        if (imageExtensions.indexOf(fileExt) !== -1) {
          fs.renameSync(req.files.fotocopy_npwp[0].path, `${req.files.fotocopy_npwp[0].path}.${fileExt}`);
          req.files.fotocopy_npwp[0].filename = `${req.files.fotocopy_npwp[0].filename}.${fileExt}`;
          return true;
        }

        fs.rmSync(req.files.fotocopy_npwp[0].path);
        throw new Error('File harus berupa gambar');
      }

      throw new Error('Pilih berkas fotocopy NPWP Anda');
    }).bail(),
  (req, res, next) => (!validationResult(req).isEmpty() ? next(HTTPErrors.BadRequest('validation')) : next()),
];
