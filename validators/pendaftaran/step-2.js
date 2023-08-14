const { body, validationResult } = require('express-validator');
const HTTPErrors = require('http-errors');
const {
  JenisUsaha, SektorUsaha, RegProvinces, RegRegencies, RegDistricts, RegVillages,
} = require('../../models');

/** @type {Function[]} */
module.exports = [
  body('jenis_usaha')
    .notEmpty()
    .withMessage('Pilih jenis usaha Anda').bail()
    .custom((value, { req }) => JenisUsaha.findByPk(value).then((jenisUsaha) => {
      if (jenisUsaha === null) {
        throw new Error('Jenis usaha tidak valid');
      }

      req.jenisUsaha = jenisUsaha;
      return true;
    }))
    .bail(),
  body('sektor_usaha')
    .notEmpty()
    .withMessage('Pilih sektor usaha Anda').bail()
    .custom((value, { req }) => SektorUsaha.findByPk(value).then((sektorUsaha) => {
      if (sektorUsaha === null) {
        throw new Error('Sektor usaha tidak valid');
      }

      req.sektorUsaha = sektorUsaha;
      return true;
    }))
    .bail(),
  body('provinsi')
    .notEmpty().withMessage('Silahkan pilih provinsi usaha Anda').bail()
    .custom((value, { req }) => RegProvinces.findByPk(value).then((province) => {
      if (province === null) {
        throw new Error('Provinsi tidak valid');
      }

      req.province = province;
      return true;
    }))
    .bail(),
  body('kabupaten_atau_kota')
    .notEmpty().withMessage('Silahkan pilih kabupaten atau kota usaha Anda').bail()
    .custom((value, { req }) => RegRegencies.findByPk(value).then((regency) => {
      if (regency === null) {
        throw new Error('Kabupaten/Kota tidak valid');
      }

      req.regency = regency;
      return true;
    }))
    .bail(),
  body('kecamatan')
    .notEmpty().withMessage('Silahkan pilih kecamatan usaha Anda').bail()
    .custom((value, { req }) => RegDistricts.findByPk(value).then((district) => {
      if (district === null) {
        throw new Error('Kecamatan tidak valid');
      }

      req.district = district;
      return true;
    }))
    .bail(),
  body('desa_atau_kelurahan')
    .notEmpty().withMessage('Silahkan pilih desa/kelurahan usaha Anda').bail()
    .custom((value, { req }) => RegVillages.findByPk(value).then((village) => {
      if (village === null) {
        throw new Error('Desa/Kelurahan tidak valid');
      }

      req.village = village;
      return true;
    }))
    .bail(),
  (req, res, next) => {
    req.body.jenis_usaha = req?.jenisUsaha?.name;
    req.body.sektor_usaha = req?.sektorUsaha?.name;
    req.body.provinsi = req?.province?.name;
    req.body.kabupaten_atau_kota = req?.regency?.name;
    req.body.kecamatan = req?.district?.name;
    req.body.desa_atau_kelurahan = req?.village?.name;

    return next();
  },
  (req, res, next) => (!validationResult(req).isEmpty() ? next(HTTPErrors.BadRequest('validation')) : next()),
];
