const getCountryByLatLng = require('./getCountryByLatLng.js');
const haversineDistance = require('./haversineDistance.js');

const City = require('../models/city.js');
const Country = require('../models/country.js');

function getImageByLatLng(lat, lng) {
  return getCountryByLatLng(lat, lng)
    .then((country) => {
      return [ country, City.find({ country }) ];
    })
    .all()
    .spread((country, cities) => {
      let closestCity = null;
      let distanceToClosestCity = Infinity;

      cities.forEach((city) => {
        const distanceToCity = haversineDistance([lat, lng], [city.lat, city.lng]);

        if (distanceToCity <= city.range && distanceToCity < distanceToClosestCity) {
          closestCity = city;
          distanceToClosestCity = distanceToCity;
        }
      });

      if (closestCity) {
        return closestCity.image;
      } else {
        return Country.findOne({ name: country })
          .then((country) => {
            if (!country) {
              // TODO handle error
            }

            return country.image;
          });
      }
    });
}

module.exports = getImageByLatLng;
