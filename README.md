# Place image API

This is a tool we built for Outward which helps you to get images of cities (with fallbacks to countries), based on a latitude, longitude coordinate.

It operates an HTTP server that you can make requests to, passing lat, lng coordinates, and returns JSON with a path to the best image in the database, for the location of those coordinates.

### Setup

This service uses MongoDB to store data about cities and countries - to use it, you will need a database of all cities and countries, following the models specificed in the `/models` directory. (In a future version, we will provide a file to set up this database for you).

It also relies on the Google Maps API for looking up countries given a coordinate.

You need to create a file named `config.json` in the root directory of this service, that fits the following structure:
```
{
  "mongoUrl": "< a mongo:// url that connects to your mongodb instance >",
  "mapsApiKey": "< your google maps api key >",
  "port": "< optional: the port to start the server on >"
}
```

To start the server, you should simply have to run:
```
npm start
```

That's it! You should now be up and running!

### Requesting an image

Make a GET request to `/`, passing a querystring like `?lat=< latitude >&lng=< longitude >`.

This will return you a JSON object that looks like:
```
{
  image: '<path to the image>'
}
```

### How does it work?

When you pass a lat, lng coordinate, this service hits the Google Maps API, and finds what country this coordinate is in.

Then, it goes to our database and fetches all the cities in that country. It loops those cities, calculating a haversine distance from the given coordinate to the coordinate of that city, and checks if that distance falls within the range of that city. If so, it returns the image of that city.

If it doesn't match any cities, it will fallback to providing the image of that country instead.

### TODO's
- We should just return the actual image data instead of a path to the image, for convenience's sake.
- Needs to have a caching mechanism built into it so it's not doing a whole bunch of hard work when you request the same image over and over again. This works in with the above point about actually returning the image rather than a path - can cache the image data, and maybe match hashes of lat, lng coordinates to an image (or something along those sorts of lines).
