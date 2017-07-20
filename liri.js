var client_ID = "5e13bf944c6044edb7e8a44e43e6c9ac";
var client_Secret = "937c2eeeb01d4696b4a39a690dcde18d";
var beginSpotUrl = "https://api.spotify.com"
var request = require("request");
var Spotify = require('node-spotify-api');
var Twit = require('twit');
var config = require('./keys.js');
var fs = require("fs");
// Grab the movieName which will always be the third node argument.
var apiToSearch = process.argv[2];
var searchTerm = process.argv.splice(3);
runRequest();
// Then run a request to the OMDB API with the movie specified
function runRequest(){
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
  var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=40e9cece";
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log("Title: " + JSON.parse(body).Title);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("--------------------------------------")
      //console.log("Rotten Tomatoes URL: " + JSON.parse(body).Ratings[1].Url);
      //console.log(JSON.parse(body));
    }
  });
};

function spotify() {
  var spotify = new Spotify({
    id: "5e13bf944c6044edb7e8a44e43e6c9ac",
    secret: "937c2eeeb01d4696b4a39a690dcde18d"
    //limit: 1;
  });

  spotify
    .search({
      type: 'track',
      query: searchTerm,
      limit: 5
    })
    .then(function(response) {
      //var responseParse=JSON.parse(response);
      //console.log(response.tracks.items);
      for (var i = 0; i < response.tracks.items.length; i++) {
        //console.log("Artists: "+JSON.stringify(response.tracks.items[1]));
        console.log("Album Name: " + response.tracks.items[i].album.name);
        console.log("Artist Name: " + response.tracks.items[i].artists[0].name);
        console.log("Preview URL: " + response.tracks.items[i].preview_url);
        console.log("Song Name: " + response.tracks.items[i].name);
        console.log("-----------------------------------------------")
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

function tweet() {


  var T = new Twit(config.twitterKeys); //this is the object of twit which
  var params = {
    //q: 'akshay',
    screen_name: 'May Winter',
    count: 20
  }
  T.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        //console.log(tweets[0]);
        console.log("Text: "+tweets[i].text);
        console.log("Time of Tweet: "+tweets[i].created_at)
        console.log("----------------------------------------");
      }

    }
  });

  // T.get('search/tweets', params,searchedData);
  //
  // function searchedData(err, data, response) {
  // console.log(data);
  // }
};
function random(){
fs.readFile("random.txt", "utf8", function(error, dat) {

  if (error) {
    return console.log(error);
  }

  //console.log(dat);

  var dataArr = dat.split(",");
  apiToSearch = dataArr[0];
  searchTerm = dataArr[1];
  runRequest();
  //console.log(dataArr);
  //for(var i=0; i<dataArr.length; i++){
  //  console.log("api:"+dataArr[0]);
  //console.log("song"+dataArr[1])
  //}
});
};
