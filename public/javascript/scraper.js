$("#articlescrape").on("click", function(event) {

    $.ajax("/scrape", {
        type: "GET"
    }).then(
        function() {
            // Reload the page to get the updated list
            location.reload();
        }
    );
})

$(".savearticle").on("click", function(event) {

   var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId,
    // data: {
    //  saved: true
    // }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });
});

$(".savedarticles").on("click", function(event) {

   $.ajax({
    method: "GET",
    url: "/articles",
    })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });
})