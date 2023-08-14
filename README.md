# UMKM Monitoring

**Database Diagram**

https://dbdiagram.io/d/64be81a102bd1c4a5e99293a


**Project Structure**

- database/
  - migrations/
    - [migration files]
    - ...
  - seeders/
    - [seeder files]
    - ...
  - config.json
- x



```js
createPdfBinary({
    content: [
      'Amaterasu',
      'Amaterasux',
      {
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ['*', 'auto', 100, '*'],
          body: [
            ['First', 'Second', 'Third', 'The last one'],
            ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
            [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4'],
          ],
        },
      },
    ],
  }, (pdfFile) => {
    res.contentType('application/pdf');
    res.send(pdfFile);
  }, (error) => {
    res.send(`ERROR : ${error}`);
  });
```