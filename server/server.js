var express = require('express');
var app = express();

app.use(express.static(__dirname + '/build'));

app.listen(8080);

console.log("Server started Listening on port: 8080");
console.log("Serving static files from: ", __dirname + '/build');

module.exports = app;
