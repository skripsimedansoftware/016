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
        as: 'owner',
      },
    ],
  }).then(({ count, rows }) => res.json({ count, rows }), next);
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
  DaftarUsaha.findByPk(req.params.id).then((daftarUsaha) => {
    if (daftarUsaha === null) {
      return next();
    }

    return res.json(daftarUsaha);
  }, next);
});

app.get('/:id/omzet', (req, res, next) => {
  DaftarUsaha.findByPk(req.params.id).then((daftarUsaha) => {
    if (daftarUsaha === null) {
      return next();
    }

    return res.json(daftarUsaha);
  }, next);
});

app.post('/:id/omzet', (req, res, next) => {
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

    return res.json(daftarUsaha);
  }, next);
});

app.get('/:id/set-status/:status', (req, res, next) => {
  const { status } = req.params;
  DaftarUsaha.findByPk(req.params.id).then((daftarUsaha) => {
    if (daftarUsaha === null) {
      return next();
    }

    return daftarUsaha.update({ status }).then((updated) => res.json(updated), next);
  }, next);
});

module.exports = app;
