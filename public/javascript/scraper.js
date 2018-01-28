$("#articlescrape").on("click", function(event) {

    $.ajax("/scrape", {
        type: "GET"
    }).then(function() {
        // Reload the page to get the updated list
        location.reload();
    });
})

$(".savearticle").on("click", function(event) {

    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "PUT",
        url: "/articles/" + thisId,
    }).then(function(data) {
       location.reload();
    });
});

$(".savedarticles").on("click", function(event) {

    $.ajax({
        method: "GET",
        url: "/articles",
    }).then(function(data) {
        // Log the response
        console.log(data);
    });
})

$(".delete").on("click", function(event) {

    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
    }).then(function(data) {
        location.reload();
    });
});