const axios = require('axios');
const config = require('../config.json');

const API_KEY = config.mapsApiKey;

function getCountryByLatLng(lat, lng) {
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
    .then((res) => {
      let country = null;

      res.data.results[0].address_components.forEach((addrComponent) => {
        if (addrComponent.types.indexOf('country') >= 0) {
          country = addrComponent.long_name;
        }
      });

      return country;
    });
}

module.exports = getCountryByLatLng;
