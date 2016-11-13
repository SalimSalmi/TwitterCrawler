const Twitter = require('twitter');
const credentials = require("./credentials");
const client = new Twitter(credentials);
const fs = require("fs");

const params = {
  locations: '4.73,52.29,4.98,52.42'
}

const stream = client.stream('statuses/filter', params);

const startD = new Date();

const schiphol = {
  nw: [4.73, 52.29],
  se: [4.77, 52.32]
}

stream.on('data', function(event) {
  if(!event.id){
    console.log('no event id');
    return;
  }

  var currD = new Date();

  var log = currD - startD;

  log += " " + event.id;

  if(event.coordinates) {
    if(event.coordinates.coordinates[0] >= schiphol.nw[0] &&
      event.coordinates.coordinates[1] >= schiphol.nw[1] &&
      event.coordinates.coordinates[0] <= schiphol.se[0] &&
      event.coordinates.coordinates[1] <= schiphol.se[1]) {
      log += ' schiphol'
    }
  }

  fs.appendFile('tweets2.txt', log + "\n", function (err) {
    if(err){
      console.log('Error appending file.');
      console.log(err);
    }
  });
  console.log(log);
});

stream.on('error', function(error) {
  throw error;
});
