const express = require('express');
const app = express();
const path = require('path');
// const fs = require('fs');
// const { log } = require('console');

const imagesPath = path.join(__dirname, '../hgems/public', 'slider');
const yearfolders = path.join(__dirname, '../hgems/public', 'gallery');
// const imgfolders = path.join(__dirname, '../hgems/public/gallery', );
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);


app.use(express.static('public'));
app.use(express.json());
app.get('/api/images', (req, res) => {
  fs.readdir(imagesPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send({'error': 'Internal Server Error'});
    } else {
      res.json(files);
    }
  });
});

// Year
app.get('/api/getYears', async (req, res) => {
  try {
    const files = await readdir(yearfolders);
    const arr = [];
    for (const file of files) {
      const eventFiles = await readdir(`${yearfolders}/${file}`);
      for (const evt of eventFiles) {
        const imgFiles = await readdir(`${yearfolders}/${file}/${evt}`);
        if (imgFiles[0] !== undefined) {
          const yearData = {
            'year': file,
            'img': imgFiles[0] !== undefined ? `gallery/${file}/${evt}/${imgFiles[0]}` : ''
          };
          arr.push(yearData);
          break;
        }
        // console.log(arr);
        // if (arr.includes(file)) {
        //   console.log('ffffffffffffffffffff');
        //   break;
        // }
      }
    }
    res.json(arr);
  } catch (err) {
    console.error(err);
    res.status(500).send({ 'error': 'Internal Server Error' });
  }
});

// Events in year
app.post('/api/getAllYearImage', async(req, res) => {
  let file = req.body.year;
  try {
    const arr = [];
    const eventFiles = await readdir(`${yearfolders}/${file}`);
    for (const fdr of eventFiles) {
      const imgFiles = await readdir(`${yearfolders}/${file}/${fdr}`);
      if (imgFiles[0] !== undefined) {
        const yearData = {
          'year': file,
          'eventType': fdr,
          'img': imgFiles[0] !== undefined ? `gallery/${file}/${fdr}/${imgFiles[0]}` : ''
        };
        arr.push(yearData);
      }
    }
    res.json(arr);
  } catch (err) {
    console.error(err);
    res.status(500).send({ 'error': 'Internal Server Error' });
  }
});

app.post('/api/getAllEventImage', async(req, res) => {
  let file = req.body.year;
  let fdr = req.body.event;
  try {
    const arr = [];
    // const eventFiles = await readdir(`${yearfolders}/${file}`);
    // for (const fdr of eventFiles) {
      const imgFiles = await readdir(`${yearfolders}/${file}/${fdr}`);
      for (const img of imgFiles) {
        // if (imgFiles[0] !== undefined) {
          const imgData = {
            'year': file,
            'eventType': fdr,
            'img': img !== undefined ? `gallery/${file}/${fdr}/${img}` : ''
          };
          arr.push(imgData);
        // }
      }
    // }
    res.json(arr);
  } catch (err) {
    console.error(err);
    res.status(500).send({ 'error': 'Internal Server Error' });
  }
});

// gallery

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
