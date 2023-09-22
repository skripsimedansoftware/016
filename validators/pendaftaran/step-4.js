const fs = require('node:fs');
const mime = require('mime');
const { body, validationResult } = require('express-validator');
const HTTPErrors = require('http-errors');

/** @type {Function[]} */
module.exports = [
  body('fotocopy_keterangan_usaha')
    .custom((_value, { req }) => {
      const imageExtensions = ['jpg', 'jpeg', 'png'];

      if (req.files?.fotocopy_keterangan_usaha) {
        const fileExt = mime.getExtension(req.files.fotocopy_keterangan_usaha[0].mimetype);
        if (imageExtensions.indexOf(fileExt) !== -1) {
          fs.renameSync(req.files.fotocopy_keterangan_usaha[0].path, `${req.files.fotocopy_keterangan_usaha[0].path}.${fileExt}`);
          req.files.fotocopy_keterangan_usaha[0].filename = `${req.files.fotocopy_keterangan_usaha[0].filename}.${fileExt}`;
          return true;
        }

        fs.rmSync(req.files.fotocopy_keterangan_usaha[0].path);
        throw new Error('File harus berupa gambar');
      }

      throw new Error('Pilih berkas fotocopy keterangan usaha Anda');
    }),
  body('fotocopy_izin_usaha')
    .custom((_value, { req }) => {
      const imageExtensions = ['jpg', 'jpeg', 'png'];

      if (req.files?.fotocopy_izin_usaha) {
        const fileExt = mime.getExtension(req.files.fotocopy_izin_usaha[0].mimetype);
        if (imageExtensions.indexOf(fileExt) !== -1) {
          fs.renameSync(req.files.fotocopy_izin_usaha[0].path, `${req.files.fotocopy_izin_usaha[0].path}.${fileExt}`);
          req.files.fotocopy_izin_usaha[0].filename = `${req.files.fotocopy_izin_usaha[0].filename}.${fileExt}`;
          return true;
        }

        fs.rmSync(req.files.fotocopy_izin_usaha[0].path);
        throw new Error('File harus berupa gambar');
      }

      throw new Error('Pilih berkas fotocopy izin usaha Anda');
    }),
  body('foto_produksi')
    .custom((_value, { req }) => {
      const imageExtensions = ['jpg', 'jpeg', 'png'];

      if (req.files?.foto_produksi) {
        req.files.foto_produksi.map((item) => {
          const fileExt = mime.getExtension(item.mimetype);
          if (imageExtensions.indexOf(fileExt) !== -1) {
            fs.renameSync(item.path, `${item.path}.${fileExt}`);
            item.filename = `${item.filename}.${fileExt}`;
            return item;
          }

          fs.rmSync(item.path);
          throw new Error('File harus berupa gambar');
        });
      }

      throw new Error('Pilih berkas foto produksi usaha Anda');
    }),
  (req, res, next) => (!validationResult(req).isEmpty() ? next(HTTPErrors.BadRequest('validation')) : next()),
];
