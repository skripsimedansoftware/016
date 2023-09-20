const express = require('express');
const multer = require('multer');
const HTTPErrors = require('http-errors');
const { DaftarUsaha, Pengguna } = require('../models');
const { pendaftaran } = require('../validators');
const io = require('../websocket');
const { step5 } = require('../validators/pendaftaran');

const app = express.Router();
const upload = multer({
  dest: 'public/uploads',
});

/**
 * * Step 1
 * * Data pendaftaran :
 * * - NIK
 * * - Nomor HP
 * * - Fotocopy KK
 * * - Fotocopy KTP
 * * - Fotocopy NPWP
 */
app.post(
  '/step-1',
  upload.fields([
    {
      name: 'fotocopy_kk',
      maxCount: 1,
    },
    {
      name: 'fotocopy_ktp',
      maxCount: 1,
    },
    {
      name: 'fotocopy_npwp',
      maxCount: 1,
    },
  ]),
  pendaftaran.step1,
  (req, res, next) => {
    const { nik, nomor_hp } = req.body;

    Pengguna.findByPk(req.user).then((pengguna) => {
      if (pengguna === null) {
        return next(HTTPErrors.NotFound('Pengguna tidak ditemukan'));
      }

      return pengguna
        .update({
          nik,
          nomor_hp,
          fotocopy_kk: req.files.fotocopy_kk[0].filename,
          fotocopy_ktp: req.files.fotocopy_ktp[0].filename,
          fotocopy_npwp: req.files.fotocopy_npwp[0].filename,
        })
        .then(() => res.json(pengguna), next);
    });
  },
);

/**
 * * Step 2
 * * Data pendaftaran :
 * * - Sektor usaha
 * * - Jenis usaha
 * * - Provinsi
 * * - Kabupaten / Kota
 * * - Kecamatan
 * * - Desa / Kelurahan
 */
app.post('/step-2', pendaftaran.step2, (req, res, next) => {
  const {
    sektor_usaha,
    jenis_usaha,
    provinsi,
    kabupaten_atau_kota,
    kecamatan,
    desa_atau_kelurahan,
  } = req.body;

  Pengguna.findByPk(req.user, {
    include: [
      {
        model: DaftarUsaha,
        as: 'usaha',
      },
    ],
  }).then((pengguna) => {
    if (pengguna === null) {
      return next(HTTPErrors.NotFound('Pengguna tidak ditemukan'));
    }

    if (pengguna.usaha === null) {
      return DaftarUsaha.create({
        owner: req.user,
        jenis_usaha,
        sektor_usaha,
        provinsi,
        kabupaten_atau_kota,
        kecamatan,
        desa_atau_kelurahan,
      }).then(
        (created) => DaftarUsaha.findByPk(created.id).then((usaha) => res.json(usaha), next),
        next,
      );
    }

    return pengguna.usaha
      .update({
        jenis_usaha,
        sektor_usaha,
        provinsi,
        kabupaten_atau_kota,
        kecamatan,
        desa_atau_kelurahan,
      })
      .then((updated) => res.json(updated), next);
  }, next);
});

/**
 * * Step 3
 * * Data pendaftaran :
 * * - Brand / nama usaha
 * * - Deskripsi produk
 * * - Detail usaha
 * * - Alamat
 */
app.post('/step-3', pendaftaran.step3, (req, res, next) => {
  Pengguna.findByPk(req.user, {
    include: [
      {
        model: DaftarUsaha,
        as: 'usaha',
      },
    ],
  }).then((pengguna) => {
    if (pengguna === null) {
      return next(HTTPErrors.NotFound('Pengguna tidak ditemukan'));
    }

    return pengguna.usaha
      .update({
        fotocopy_keterangan_usaha: req.files.fotocopy_keterangan_usaha[0].filename,
        fotocopy_izin_usaha: req.files.fotocopy_izin_usaha[0].filename,
        foto_produksi: JSON.stringify(req.files.foto_produksi.map((item) => item.filename)),
      })
      .then((updated) => res.json(updated), next);
  });
});

/**
 * * Step 4
 * * Data pendaftaran :
 * * - Fotocopy keterangan usaha
 * * - Fotocopy izin usaha
 * * - Foto produksi
 */
app.post(
  '/step-4',
  upload.fields([
    {
      name: 'fotocopy_keterangan_usaha',
      maxCount: 1,
    },
    {
      name: 'fotocopy_izin_usaha',
      maxCount: 1,
    },
    {
      name: 'foto_produksi',
      maxCount: 20,
    },
  ]),
  pendaftaran.step4,
  (req, res, next) => {
    Pengguna.findByPk(req.user, {
      include: [
        {
          model: DaftarUsaha,
          as: 'usaha',
        },
      ],
    }).then((pengguna) => {
      if (pengguna === null) {
        return next(HTTPErrors.NotFound('Pengguna tidak ditemukan'));
      }

      io.to('admin').emit('data-usaha', pengguna.usaha.id);
      return pengguna.usaha
        .update({
          fotocopy_keterangan_usaha: req.files.fotocopy_keterangan_usaha[0].filename,
          fotocopy_izin_usaha: req.files.fotocopy_izin_usaha[0].filename,
          foto_produksi: JSON.stringify(req.files.foto_produksi.map((item) => item.filename)),
        })
        .then((updated) => res.json(updated), next);
    });
  },
);

/**
 * * Step 5
 * * Data pendaftaran :
 * * - Latitude
 * * - Longitude
 */
app.post('/step-5', step5, (req, res, next) => {
  Pengguna.findByPk(req.user, {
    include: [
      {
        model: DaftarUsaha,
        as: 'usaha',
      },
    ],
  }).then((pengguna) => {
    if (pengguna === null) {
      return next(HTTPErrors.NotFound('Pengguna tidak ditemukan'));
    }

    return pengguna.usaha
      .update({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        status: 'pengajuan',
      })
      .then((updated) => res.json(updated), next);
  });
});

module.exports = app;
