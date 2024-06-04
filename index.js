const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render('index', { files: files });
  });
});

// To read files and there's seperate .ejs files to view data
app.get('/files/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, 'utf-8', function (err, filedata) {
    res.render('show', { filename: req.params.filename, filedata: filedata });
  });
});

// We can edit the filename using below two routes
app.get('/edit/:filename', (req, res) => {
  res.render('edit', { filename: req.params.filename });
});

app.post('/edit', (req, res) => {
  fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, (err) => {
    res.redirect('/');
  });
});

// To post content
app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title}.txt`, req.body.details, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen('3000', () => {
  console.log('Example app listening on port 3000!');
});
