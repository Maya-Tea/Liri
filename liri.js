var client_ID = "5e13bf944c6044edb7e8a44e43e6c9ac";
var client_Secret = "937c2eeeb01d4696b4a39a690dcde18d";
var beginSpotUrl = "https://api.spotify.com"
var request = require("request");
var Spotify = require('node-spotify-api');
var Twit = require('twit');
var config = require('./keys.js');
var fs = require("fs");

var apiToSearch = process.argv[2];
var searchTerm = process.argv.splice(3);

//Check if log.txt file exists if not write the file
fs.stat('log.txt', function(err, stat) {
    if(err == null) {
        appendSearchTerms();
        runRequest();
    } else if(err.code == 'ENOENT') {
        fs.writeFile("log.txt", "SEARCH LOG\n------------------------------------------------------", function(err) {
          if (err) {
            return console.log(err);
          }
        appendSearchTerms();
        runRequest();
        });
    } else {
        console.log('Some other error: ', err.code);
    }
});

function appendSearchTerms(){
fs.appendFile("log.txt", "\nSEARCH: " + apiToSearch + ", " + searchTerm.join(" "), function(err) {
  if (err) {
    return console.log(err);
  }
});
}


function runRequest() {
  switch (apiToSearch) {
    case "spotify-this-song":
      spotify();
      break;

    case "movie-this":
      imdb();
      break;

    case "my-tweets":
      tweet();
      break;

    case "do-what-it-says":
      random();
      break;
  }
};

function imdb() {
  console.log(searchTerm);
  if (!searchTerm.toString()) {
    searchTerm = "Coraline";
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=" + config.imdbKey;
  request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {

      var output = "\nTitle: " + JSON.parse(body).Title + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRelease Year: " + JSON.parse(body).Year + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot +
        "\nActors: " + JSON.parse(body).Actors;
      //console.log("Rotten Tomatoes URL: " + JSON.parse(body).Ratings[1].Url);
      //console.log(JSON.parse(body));

      displayAndWrite(output);
    }
  });
};

function spotify() {
  if (!searchTerm.toString()) {
    searchTerm = "My mind is an echo chamber";
  }
  var spotify = new Spotify(config.spotifyKeys);

  spotify
    .search({
      type: 'track',
      query: searchTerm,
      limit: 1
    })
    .then(function(response) {

      var output="\nAlbum Name: " + response.tracks.items[0].album.name+"\nArtist Name: " + response.tracks.items[0].artists[0].name+"\nPreview URL: " + response.tracks.items[0].preview_url+"\nSong Name: " + response.tracks.items[0].name;

      displayAndWrite(output);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function tweet() {
  var T = new Twit(config.twitterKeys);
  var params = {
    //q: 'May Winter',
    screen_name: 'May Winter',
    count: 20
  }
  T.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      var output="";
      var newstr;
      for (var i = 0; i < tweets.length; i++) {
        //console.log(tweets[0]);
        output=output.concat("\nTweet: " + tweets[i].text+"\nTime of Tweet: " + tweets[i].created_at+"\n~~~~");
      }
      displayAndWrite(output);
    }
  });

  // T.get('search/tweets', params,searchedData);
  //
  // function searchedData(err, data, response) {
  // console.log(data);
  // }
};

function random() {
  fs.readFile("random.txt", "utf8", function(error, dat) {

    if (error) {
      return console.log(error);
    }

    var dataArr = dat.split(",");
    apiToSearch = dataArr[0];
    searchTerm = dataArr[1];
    runRequest();

  });
};

function displayAndWrite(output){
  console.log(output);
  fs.appendFile("log.txt", "\n<----RESULTS----> " + output +"\n----------------------------------------------", function(err) {
    if (err) {
      return console.log(err);
    }
  });
}
