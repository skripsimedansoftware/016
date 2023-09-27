const fs = require('node:fs/promises');
const path = require('node:path');
const express = require('express');
const HTTPErrors = require('http-errors');

const {
  JenisUsaha, SektorUsaha, RegProvinces, RegRegencies, RegDistricts, RegVillages,
} = require('../models');

const app = express.Router();

const fileInfo = path.join(process.cwd(), 'info');

app.get('/info', (req, res, next) => {
  fs.statfs(fileInfo).then(() => fs.readFile(fileInfo).then((info) => {
    res.send(info.toString());
  }, () => next()), () => fs.writeFile(fileInfo, '').then((val) => {
    res.send(val);
  }, () => next()));
});

app.post('/info', (req, res, next) => {
  fs.statfs(fileInfo).then(() => fs.readFile(fileInfo).then((info) => res.render('ckeditor', { data: info }), () => next()), () => fs.writeFile(fileInfo, '').then((val) => res.json(val), () => next()));
});

app.put('/info', (req, res, next) => {
  fs.writeFile(fileInfo, req.body.data).then(() => res.send(req.body.data), next);
});

app.get('/jenis-usaha', (req, res, next) => JenisUsaha.findAndCountAll().then(({ count, rows }) => res.json({ count, rows }), next));

app.post('/jenis-usaha', (req, res, next) => {
  const { name } = req.body;
  JenisUsaha.create({ name }).then((created) => res.json(created), next);
});

app.put('/jenis-usaha/:id', (req, res, next) => {
  const { name } = req.body;
  JenisUsaha.findByPk(req.params.id).then((jenisUsaha) => {
    if (jenisUsaha === null) {
      return next(HTTPErrors.NotFound('Data tidak ditemukan'));
    }

    return jenisUsaha.update({ name }).then((updated) => res.json(updated), next);
  }, next);
});

app.delete('/jenis-usaha/:id', (req, res, next) => {
  JenisUsaha.findByPk(req.params.id).then((jenisUsaha) => {
    if (jenisUsaha === null) {
      return next(HTTPErrors.NotFound('Data tidak ditemukan'));
    }

    return jenisUsaha.destroy().then((deleted) => res.json(deleted), next);
  }, next);
});

app.get('/sektor-usaha', (req, res, next) => {
  SektorUsaha.findAndCountAll().then(({ count, rows }) => res.json({ count, rows }), next);
});

app.post('/sektor-usaha', (req, res, next) => {
  const { name } = req.body;
  SektorUsaha.create({ name }).then((created) => res.json(created), next);
});

app.put('/sektor-usaha/:id', (req, res, next) => {
  const { name } = req.body;
  SektorUsaha.findByPk(req.params.id).then((sektorUsaha) => {
    if (sektorUsaha === null) {
      return next(HTTPErrors.NotFound('Data tidak ditemukan'));
    }

    return sektorUsaha.update({ name }).then((updated) => res.json(updated), next);
  }, next);
});

app.delete('/sektor-usaha/:id', (req, res, next) => {
  SektorUsaha.findByPk(req.params.id).then((sektorUsaha) => {
    if (sektorUsaha === null) {
      return next(HTTPErrors.NotFound('Data tidak ditemukan'));
    }

    return sektorUsaha.destroy().then((deleted) => res.json(deleted), next);
  }, next);
});

app.get('/provinces', (req, res, next) => {
  RegProvinces.findAndCountAll().then(({ count, rows }) => res.json({ count, rows }), next);
});

app.get('/regencies/:province_id', (req, res, next) => {
  RegRegencies.findAndCountAll({ where: { province_id: req.params.province_id } }).then(({ count, rows }) => res.json({ count, rows }), next);
});

app.get('/districts/:regency_id', (req, res, next) => {
  RegDistricts.findAndCountAll({ where: { regency_id: req.params.regency_id } }).then(({ count, rows }) => res.json({ count, rows }), next);
});

app.get('/villages/:district_id', (req, res, next) => {
  RegVillages.findAndCountAll({ where: { district_id: req.params.district_id } }).then(({ count, rows }) => res.json({ count, rows }), next);
});

module.exports = app;
