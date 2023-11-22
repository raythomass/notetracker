const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = 3001;
const util = require('util')
const readFromFile = util.promisify(fs.readFile)
const app = express();

const dbNotes = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req,res) => 
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

function writeToFile(destination, note){
  fs.writeFile(destination, JSON.stringify(note, null, 4), (error) => 
  error ? console.error(error) : console.info('Successfully updated notes'))
};

function addDB(dbNote, file){
  fs.readFile(file, 'utf8', (error , data) => {
    if (error){
      throw error
    } else{
      const note = JSON.parse(data)
      note.push(dbNote)
      writeToFile(file, note)
    }
  })
};

app.post('/api/notes', (req,res) => {
  console.info(`${req.method} request received to add a review`);

  const {title, text} = req.body;

  if (title && text) {
    const newestNote = {
      title,
      text
    };

    console.log(newestNote);
    addDB(newestNote, './db/db.json')
    res.status(201).json(dbNotes)
  };
});

// app.get()

app.listen(PORT, () =>
  console.log(`Note taker app listening at http://localhost:${PORT}`)
);