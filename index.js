const express = require('express');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

global.Promise = bluebird;

const config = require('./config.json');

const getImageByLatLng = require('./lib/getImageByLatLng.js');

const app = express();

mongoose.Promise = bluebird;
mongoose.connect(config.mongoUrl)
  .then(() => {
    app.get('/', (req, res) => {
      const lat = req.query.lat;
      const lng = req.query.lng;

      if (!lat || !lng) {
        return res.status(400).json({ error: 'Must provide a both a latitude (`lat`) and longitude (`lng`)' });
      }

      getImageByLatLng(lat, lng)
        .then((image) => res.json({ image }))
        .catch((e) => {
          console.log(e);

          res.status(500).json({ error: 'Something went wrong' });
        });
    });

    app.listen(config.port || 3000);
  });
