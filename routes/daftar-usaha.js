const express = require('express');
const { DaftarUsaha, Pengguna, OmzetUsaha } = require('../models');

const app = express.Router();

app.get('/', (req, res, next) => {
  DaftarUsaha.findAndCountAll({
    where: {
      status: 'aktif',
    },
    include: [
      {
        model: Pengguna,
        as: 'pengusaha',
      },
    ],
  }).then(({ count, rows }) => res.json({ count, rows }), next);
});

app.get('/mine', (req, res, next) => {
  DaftarUsaha.findOne({
    where: {
      owner: req.user,
    },
    attributes: ['id', 'owner', 'status'],
  }).then((daftarUsaha) => {
    if (daftarUsaha !== null) {
      return res.json(daftarUsaha);
    }

    return next();
  }, next);
});

app.get('/status/:status', (req, res, next) => {
  DaftarUsaha.findAndCountAll({
    where: {
      status: req.params.status,
    },
    include: [
      {
        model: Pengguna,
        as: 'pengusaha',
      },
    ],
  }).then(({ count, rows }) => res.json({ count, rows }), next);
});

app.get('/:id', (req, res, next) => {
  DaftarUsaha.findByPk(req.params.id, {
    include: [
      {
        model: Pengguna,
        as: 'pengusaha',
      },
    ],
  }).then((daftarUsaha) => {
    if (daftarUsaha === null) {
      return next();
    }

    return res.json(daftarUsaha);
  }, next);
});

app.get('/:id/asset-omzet', (req, res, next) => {
  DaftarUsaha.findByPk(req.params.id, {
    include: [
      {
        model: OmzetUsaha,
        as: 'omzet',
      },
    ],
  }).then((daftarUsaha) => {
    if (daftarUsaha === null) {
      return next();
    }

    return res.json(daftarUsaha.omzet);
  }, next);
});

app.post('/:id/asset-omzet', (req, res, next) => {
  const { asset, omzet, tahun } = req.body;
  DaftarUsaha.findByPk(req.params.id, { attributes: ['id'] }).then((daftarUsaha) => {
    if (daftarUsaha === null) {
      return next();
    }

    return OmzetUsaha.create({
      asset, omzet, tahun, usaha_id: daftarUsaha.id,
    }).then((data) => res.json(data), next);
  }, next);
});

app.get('/:id/set-status/:status', (req, res, next) => {
  const { status } = req.params;
  const { catatan } = req.query;
  DaftarUsaha.findByPk(req.params.id).then((daftarUsaha) => {
    if (daftarUsaha === null) {
      return next();
    }

    return daftarUsaha.update({ catatan, status }).then((updated) => res.json(updated), next);
  }, next);
});

module.exports = app;
