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

$("#savenote").on("click", function(event) {

    var thisId = $(this).attr("data-id");
console.log(this);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/"+thisId,
        data: {
            note: $("#note").val()
        }
    }).then(function(data) {
        location.reload();
    });
});

$(".note").on("click", function(event) {

    var thisId = $(this).attr("data-id");
$("#notemodal").modal("show");
$("#deletenote").attr("data-id", thisId);
$("#savenote").attr("data-id", thisId);
  //   $.ajax({
  //   method: "GET",
  //   url: "/articles/" + thisId
  // })
  //   // With that done, add the note information to the page
  //   .then(function(data) {
  //     console.log(data);
      // $("#newnote").append()
      // $("#newnote").append("<button id='deletenote'>Delete</button>");


      // $("#notes").append("<h2>" + data.title + "</h2>");
      // // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // // A button to submit a new note, with the id of the article saved to it
      // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // // If there's a note in the article
      // if (data.note) {
      //   // Place the title of the note in the title input
      //   $("#titleinput").val(data.note.title);
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(data.note.body);
      // }
    });
