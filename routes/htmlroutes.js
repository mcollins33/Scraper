var express = require("express");
var app = express();
var path = require("path");

module.exports = function(app) {

app.get("/", function(req, res) {
 
    res.render("index", { quotes: data });
  });


};