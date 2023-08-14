require('dotenv/config');
const http = require('node:http');
const cors = require('cors');
const express = require('express');
const HTTPErrors = require('http-errors');
const morgan = require('morgan');
const { validationResult } = require('express-validator');
const { SHA1 } = require('crypto-js');
const io = require('./websocket');
const models = require('./models');

models.sequelize.sync({ alter: true }).then(() => {
  models.Pengguna.count().then((total) => {
    if (total === 0) {
      models.Pengguna.bulkCreate([
        {
          email: 'admin@umkm-monitoring.com',
          username: 'admin',
          password: SHA1('admin').toString(),
          nama_lengkap: 'Administrator',
          jabatan: 'admin',
        },
        {
          email: 'kepala-dinas@umkm-monitoring.com',
          username: 'kepdin',
          password: SHA1('kepdin').toString(),
          nama_lengkap: 'Kepala Dinas',
          jabatan: 'kepala-dinas',
        },
      ]);
    }
  });
});
// models.sequelize.sync({ force: true });

const app = express();

const authRouter = require('./routes/auth');
const daftarUsahaRouter = require('./routes/daftar-usaha');
const metaDataRouter = require('./routes/meta-data');
const pendaftaranRouter = require('./routes/pendaftaran');
const penggunaRouter = require('./routes/pengguna');
const { HTTPBearer } = require('./middleware/auth.middleware');

app.use(cors());
app.use(morgan('dev'));
app.use(HTTPBearer);
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/daftar-usaha', daftarUsahaRouter);
app.use('/meta-data', metaDataRouter);
app.use('/pendaftaran', pendaftaranRouter);
app.use('/pengguna', penggunaRouter);

app.use((req, res, next) => next(HTTPErrors.NotFound('Halaman tidak ditemukan')));

app.use((err, req, res, next) => {
  if (!res.headersSent) {
    if (HTTPErrors.isHttpError(err)) {
      res.status(err.statusCode);
      // * Bad request
      if (err.status === 400) {
        // Validation
        if (err.message === 'validation') {
          return res.json({
            error: validationResult(req).mapped(),
          });
        }

        // JSON format
        if (err.message.match(/Unexpected token (.*) in JSON at position \d{1,}/)) {
          return res.json({ error: err.message });
        }
      }

      // * Unauthorized
      if (err.status === 401) {
        return res.json({ error: err.message });
      }

      // * Not found
      if (err.status === 404) {
        return res.json({ error: err.message });
      }
    }
  }

  return next(err);
});

const server = http.createServer(app);

server.on('listening', () => {
  io.attach(server);
  console.log(`app started on port : ${server.address().port}`);
});

server.listen(process.env.PORT || 3000);
