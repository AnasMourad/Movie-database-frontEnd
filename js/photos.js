$( document ).ready(function() {
    var movies;
    $.get("js/data.json", function(data){
        movies = data;
    });


        $.get("photo.html", function (template) {
            var html_maker = new htmlMaker(template); //create an html Maker
            var html = html_maker.getHTML(movies["movies"]); //generate dynamic HTML based on the data
            $("#movies-grid").html(html);


    });
});