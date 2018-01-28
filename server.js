var express = require("express");
var app = express();
var PORT = 3000;
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// var logger = require("morgan");
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");

var db = require("./models");

// Use morgan logger for logging requests
// app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/AJCArticles";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {

    request("http://www.ajc.com/", function(error, response, body) {

        var $ = cheerio.load(body);

        $("div.item-headline").each(function(i, element) {

            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function(dbArticle) {

                    console.log(dbArticle);
                })
                .catch(function(err) {

                    return res.json(err);
                });
        });

        res.send("Scrape Complete");
    });
});

app.get("/", function(req, res) {
    db.Article.find({saved: false})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            console.log(dbArticle);
            res.render("index", { article: dbArticle })
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

app.get("/articles", function(req, res) {
    db.Article.find({ saved: true })
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            console.log(dbArticle);
            res.render("saved", { article: dbArticle })
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

app.put("/articles/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: {saved: true}})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            console.log(dbArticle);
             res.render("index", { article: dbArticle })
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});


app.delete("/articles/:id", function(req, res) {
    db.Article.findOneAndRemove({ _id: req.params.id })
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            console.log(dbArticle);
            res.render("saved", { article: dbArticle })
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});