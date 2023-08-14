const path = require('node:path');
const express = require('express');
const { DaftarUsaha, Pengguna } = require('../models');

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

app.get('/maps', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/maps.html'));
});

app.get('/status/:status', (req, res, next) => {
  DaftarUsaha.findAndCountAll({
    where: {
      status: req.params.status,
    },
    include: [
      {
        model: Pengguna,
        as: 'owner',
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

module.exports = app;
