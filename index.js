const express = require('express');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const path = require('path');
const geohash = require('ngeohash');
const fs = require('fs');

global.Promise = bluebird;

const config = require('./config.json');

const getImageByLatLng = require('./lib/getImageByLatLng.js');

const app = express();

function addToCache(image, hash) {
  const filePath = 'images/' + image;
  const cachePath = 'cache/' + hash + '.jpg';

  fs.copyFile(path.resolve(filePath), path.resolve(cachePath), () => {});
}

function lookup(lat, lng, hash) {
  getImageByLatLng(lat, lng)
    .then((image) => {
      addToCache(image, hash);

      res.sendFile(path.resolve('images/' + image));
    });
}

function serveFromCache(hash) {
  const filePath = 'cache/' + hash + '.jpg';

  return res.sendFile(path.resolve(filePath));
}

mongoose.Promise = bluebird;
mongoose.connect(config.mongoUrl)
  .then(() => {
    app.get('/', (req, res) => {
      const lat = req.query.lat;
      const lng = req.query.lng;

      if (!lat || !lng) {
        return res.status(400).json({ error: 'Must provide a both a latitude (`lat`) and longitude (`lng`)' });
      }

      const hash = geohash.encode(lat, lng);

      fs.stat(hash + '.jpg', (err) => {
        if (err) {
          // File doesn't exist - look it up
          lookup(lat, lng, hash);
        } else {
          // File exists - serve it from cache
          serveFromCache(hash);
        }
      });
    });

    app.listen(config.port || 3000);
  });
