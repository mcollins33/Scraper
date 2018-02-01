var express = require("express");
var app = express();
var PORT = 3000;
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");

var db = require("./models");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/AJCArticles";

mongoose.Promise = Promise;

mongoose.connect(MONGODB_URI), {
  useMongoClient: true
};

var articles;

app.get("/scrape", function(req, res) {

    request("http://www.ajc.com/", function(error, response, body) {
    // request("http://time.com/", function(error, response, body) {
        
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

                })
                .catch(function(err) {

                    return res.json(err);
                });
        });

        // $("div.home-brief-title-and-excerpt").each(function(i, element) {

        //     var result = {};

        //     result.title = $(this)
        //         .children("h2").eq(1)
        //         .text();
        //     result.link = $(this)
        //         .children("h2").eq(1)
        //         .attr("href");
        //     result.summary = $(this)
        //         .children("p")
        //         .text();

        //     db.Article.create(result)
        //         .then(function(dbArticle) {

        //         })
        //         .catch(function(err) {

        //             return res.json(err);
        //         });
        // });
    });
});



app.get("/", function(req, res) {
    db.Article.find({ saved: false })
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client

            res.render("index", { article: dbArticle });
            articles = dbArticle;
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});



app.get("/articles", function(req, res) {
    db.Article.find({ saved: true })
        .populate("notes")
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.render("saved", { article: dbArticle })
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

app.put("/articles/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
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

            res.render("saved", { article: dbArticle })
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

app.post("/articles/:id", function(req, res) {
    // Create a new Note in the db

    db.Note.create(req.body)
        .then(function(dbNote) {
            // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function(dbArticle) {
            // If the User was updated successfully, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {
    // Create a new Note in the db
    db.Article.find({ _id: req.params.id })
        // Specify that we want to populate the retrieved users with any associated notes
        .populate("notes")
        .then(function(dbArticle) {
            // If able to successfully find and associate all Users and Notes, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

app.delete("/delete/:id", function(req, res) {
    // Remove a note using the objectID
    db.Note.remove({
            _id: req.params.id
        },
        function(error, removed) {
            // Log any errors from mongojs
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                // Otherwise, send the mongojs response to the browser
                // This will fire off the success function of the ajax request
                console.log(removed);
                res.send(removed);
            }
        }
    );
});

app.listen(process.env.PORT || 3000, function() {
    console.log("App running on port " + PORT + "!");
});