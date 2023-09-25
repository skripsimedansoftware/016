const express = require('express');
const HTTPErrors = require('http-errors');
const { Op } = require('sequelize');
const { SHA1 } = require('crypto-js');
const { Pengguna } = require('../models');
const { signUpValidation, signInValidation } = require('../validators/auth');
const { JWTEncode, JWTDecode, JWTVerify } = require('../helpers/jwt.helper');
const io = require('../websocket');

const app = express.Router();

/** Sign up */
app.post('/sign-up', signUpValidation, (req, res, next) => {
  const { email, password, nama_lengkap } = req.body;
  Pengguna.create({ email, password: SHA1(password).toString(), nama_lengkap }).then(async (pengguna) => {
    const response = {
      id: pengguna.id,
      nik: pengguna.nik,
      email: pengguna.email,
      username: pengguna.username,
      nama_lengkap: pengguna.nama_lengkap,
      foto_profil: pengguna.foto_profil,
      jabatan: pengguna.jabatan,
    };

    const token = await JWTEncode(response);
    io.to('admin').emit('new-user', pengguna);

    // send response
    res.json({
      pengguna: response,
      token,
    });
  }, next);
});

/** Sign in */
app.post('/sign-in', signInValidation, (req, res, next) => {
  Pengguna.findOne({
    where: {
      [Op.or]: [
        { email: req.body.identity },
        { username: req.body.identity },
      ],
    },
  }).then(async (pengguna) => {
    // user not found
    if (pengguna === null) {
      return next(HTTPErrors.Unauthorized('Otentikasi gagal'));
    }

    // password not match
    if (pengguna.password !== SHA1(req.body.password).toString()) {
      return next(HTTPErrors.Unauthorized('Otentikasi gagal'));
    }

    const response = {
      id: pengguna.id,
      nik: pengguna.nik,
      email: pengguna.email,
      username: pengguna.username,
      nama_lengkap: pengguna.nama_lengkap,
      foto_profil: pengguna.foto_profil,
      jabatan: pengguna.jabatan,
    };

    const token = await JWTEncode(response);

    // authenticated
    return res.json({
      pengguna: response,
      token,
    });
  });
});

app.get('/validate-token', async (req, res, next) => {
  try {
    if (req.header('authorization')) {
      await JWTVerify(req.header('authorization').replace('Bearer', '').trim());
      const decodedJWT = JWTDecode(req.header('authorization'));
      return Pengguna.findByPk(decodedJWT.id).then(async (pengguna) => {
        const response = {
          id: pengguna.id,
          nik: pengguna.nik,
          email: pengguna.email,
          username: pengguna.username,
          nama_lengkap: pengguna.nama_lengkap,
          foto_profil: pengguna.foto_profil,
          jabatan: pengguna.jabatan,
        };

        const token = await JWTEncode(response);

        // authenticated
        return res.json({
          pengguna: response,
          token,
        });
      }, next);
    }

    return next();
  } catch (e) {
    if (e.code === 'ERR_JWT_EXPIRED') {
      const decodedJWT = JWTDecode(req.header('authorization'));
      return Pengguna.findByPk(decodedJWT.id).then(async (pengguna) => {
        const response = {
          id: pengguna.id,
          nik: pengguna.nik,
          email: pengguna.email,
          username: pengguna.username,
          nama_lengkap: pengguna.nama_lengkap,
          foto_profil: pengguna.foto_profil,
          jabatan: pengguna.jabatan,
        };

        const token = await JWTEncode(response);

        // authenticated
        return res.json({
          pengguna: response,
          token,
        });
      }, next);
    }

    return next(e);
  }
});

module.exports = app;
