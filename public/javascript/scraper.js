$("#articlescrape").on("click", function(event) {

    $.ajax("/scrape", {
        type: "GET"
    }).then(function(data) {

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

$("#savenote").on("click", function(event) {

    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            note: $("#noteinput").val()
        }
    }).then(function(data) {
        location.reload();
    });
});

$("#closenote").on("click", function(event) {
    $("#notemodal").modal("hide");
    $("#noteheader").empty();
    $("#newnotelist").empty();


});

$(".note").on("click", function(event) {
    var thisId = $(this).attr("data-id");

    $("#notemodal").modal("show");

    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function(data) {

            $("#noteheader").append("<h3>Notes for: " + data[0].title + "</h3>");
            $("#savenote").attr("data-id", thisId);
            $("#newnotelist").attr("data-id", thisId);

            // If there's a note in the article
            if (data[0].notes) {
                for (var i = 0; i < data[0].notes.length; i++) {
                    var note = $("<p>");
                    note.text(data[0].notes[i].note);
                    var button = $("<button>");
                    button.addClass("deletenote");
                    button.attr("data-id", data[0].notes[i]._id);
                    button.text("Delete");
                    $("#newnotelist").append(note);
                    $("#newnotelist").append(button);
                };
            };
        });

});
$("#newnotelist").on("click", ".deletenote", function (event) {

    var thisId = $(this).attr("data-id");


    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        type: "DELETE",
        url: "/delete/" + thisId,
        }).then(function(data) {
        location.reload();
    });

});