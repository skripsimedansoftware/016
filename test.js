const http = require('http');
const express = require('express');
const path = require('path');

const PdfMakePrinter = require('pdfmake');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

function createPdfBinary(pdfDoc, callback) {
  const fontDescriptors = {
    Roboto: {
      normal: path.join(process.cwd(), 'public', '/Roboto/Roboto-Regular.ttf'),
      bold: path.join(process.cwd(), 'public', '/Roboto/Roboto-Medium.ttf'),
      italics: path.join(process.cwd(), 'public', '/Roboto/Roboto-Italic.ttf'),
      bolditalics: path.join(process.cwd(), 'public', '/Roboto/Roboto-MediumItalic.ttf'),
    },
  };

  const printer = new PdfMakePrinter(fontDescriptors);

  const doc = printer.createPdfKitDocument(pdfDoc, {
    version: '1.4',
    compress: false,
  });

  const chunks = [];
  let result;

  const fs = require('node:fs');

  doc.on('data', (chunk) => {
    chunks.push(chunk);
  });
  doc.on('end', () => {
    result = Buffer.concat(chunks);
    callback(`data:application/pdf;base64,${result.toString('base64')}`);
  });

  doc.pipe(fs.createWriteStream('basics.pdf'));
  doc.end();
}

app.get('/pdf', (req, res) => {
  createPdfBinary({
    content: ['OKE'],
  }, (binary) => {
    res.contentType('application/pdf');
    res.send(binary);
  }, (error) => {
    res.send(`ERROR:${error}`);
  });
});

const server = http.createServer(app);
const port = process.env.PORT || 1234;
server.listen(port);

console.log('http server listening on %d', port);
