const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const HTTPErrors = require('http-errors');
const multer = require('multer');
const PDFMake = require('pdfmake');
const { Pengguna } = require('../models');
const { updateProfile } = require('../validators/pengguna');

const app = express.Router();
const upload = multer({
  dest: 'uploads',
});

/** Get all */
app.get('/', (req, res, next) => {
  const size = parseFloat(req.query.length);
  const skip = parseFloat(req.query.start);

  const limit = Number.isNaN(size) ? 10 : size;
  const offset = Number.isNaN(skip) ? 0 : skip;

  // Mengambil semua data pengguna
  Pengguna.findAndCountAll({
    offset,
    limit,
  }).then(({ rows }) => {
    // Mengirimkan response data pengguna
    res.json({
      data: rows.map((field) => {
        const { password, ...json } = field.dataValues;
        return json;
      }),
      next: (rows.length === limit),
    });
  }, next);
});

/** Profil pengguna */
app.get('/profile/:id?', (req, res, next) => {
  // Menemukan pengguna berdasarkan id
  Pengguna.findByPk(req.params?.id || req.user).then((pengguna) => {
    // Data tidak ditemukan
    if (pengguna === null) {
      return next(HTTPErrors.NotFound('Pengguna tidak ditemukan'));
    }

    const { password, ...json } = pengguna.dataValues;

    return res.json(json);
  }, next);
});

/** Perbaharui data pengguna */
app.put('/profile/:id?', upload.single('foto_profil'), updateProfile, (req, res, next) => {
  Pengguna.findByPk(req.params?.id || req.user).then((pengguna) => {
    // Data tidak ditemukan
    if (pengguna === null) {
      return next(HTTPErrors.NotFound('Pengguna tidak ditemukan'));
    }

    // Jika session
    if (pengguna.id !== req.user) {
      // Check admin
    }

    let { foto_profil } = pengguna;
    const { email, username, nama_lengkap } = req.body;

    if (req.file?.filename) {
      foto_profil = req.file.filename;
    }

    return pengguna.update({
      email,
      username,
      foto_profil,
      nama_lengkap,
    }).then((updated) => {
      const response = {
        id: updated.id,
        nik: updated.nik,
        email: updated.email,
        username: updated.username,
        nama_lengkap: updated.nama_lengkap,
        foto_profil: updated.foto_profil,
        jabatan: updated.jabatan,
      };

      return res.json(response);
    }, next);
  }, next);
});

const createPdfBinary = (PDFDoc, callback) => {
  const printer = new PDFMake({
    Roboto: {
      normal: path.join(process.cwd(), 'public', '/Roboto/Roboto-Regular.ttf'),
      bold: path.join(process.cwd(), 'public', '/Roboto/Roboto-Medium.ttf'),
      italics: path.join(process.cwd(), 'public', '/Roboto/Roboto-Italic.ttf'),
      bolditalics: path.join(process.cwd(), 'public', '/Roboto/Roboto-MediumItalic.ttf'),
    },
  });

  const pdfFile = fs.createWriteStream('public/pengguna.pdf');
  const doc = printer.createPdfKitDocument(PDFDoc);

  let result;
  const chunks = [];

  doc.on('data', (chunk) => {
    chunks.push(chunk);
  });

  doc.pipe(pdfFile);
  doc.on('end', () => {
    result = Buffer.concat(chunks);
    callback(result);
  });
  doc.end();
};

const now = new Date();

// Fungsi untuk mendapatkan string bulan dalam bahasa Inggris
function getMonthString(monthIndex) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return months[monthIndex];
}

// Fungsi untuk mendapatkan string hari dalam bahasa Inggris
function getDayString(dayIndex) {
  const days = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
  ];
  return days[dayIndex];
}

// Mendapatkan informasi tanggal dan waktu
const year = now.getFullYear();
const month = getMonthString(now.getMonth());
const day = getDayString(now.getDay());
const date = now.getDate();
// const hours = now.getHours();
// const minutes = now.getMinutes();

app.get('/print', (req, res, next) => {
  Pengguna.findAndCountAll().then(({ count, rows }) => {
    createPdfBinary({
      pageOrientation: 'landscape',
      content: [
        {
          text: 'Data Pengguna',
          bold: true,
          fontSize: 24,
          alignment: 'center',
        },
        `${day}, ${date} ${month} ${year}`,
        {
          table: {
            // headerRows: 1,
            widths: [20, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                {
                  text: 'ID',
                  bold: true,
                  alignment: 'center',
                },
                // 'NIK', 'Email', 'Username', 'Nama Lengkap', 'Jabatan',
                'Nama Usaha', 'Nama Pemilik', 'Alamat Usaha', 'Desa/Kelurahan', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Sektor Usaha', 'Jenis Usaha', 'Jenis Usaha Detail', 'Produk', 'Tahun Data', 'Omzet Pertahun', 'Asset',
              ],
              // ...rows.map((item) => [
              //   {
              //     text: item.id,
              //     bold: true,
              //     alignment: 'center',
              //   },
              //   item.nik !== null ? item.nik : '-',
              //   item.email,
              //   item.username !== null ? item.username : '-',
              //   item.nama_lengkap,
              //   item.jabatan.toUpperCase().replace('-', ' '),
              // ]),
            ],
          },
        },
      ],
      defaultStyle: {
        fontSize: 8,
        bold: true,
      },
    }, (pdfFile) => {
      res.contentType('application/pdf');
      // res.setHeader('Content-disposition', 'inline; filename="pengguna.pdf"');
      res.send(pdfFile);
    }, (error) => {
      res.send(`ERROR : ${error}`);
    });
  }, next);
});

module.exports = app;
