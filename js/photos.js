$( document ).ready(function() {
    var movies;
    $.get("js/data.json", function(data){
        movies = data;
    });


        $.get("photo.html", function (template) {
            var html_maker = new htmlMaker(template); //create an html Maker
            var html = html_maker.getHTML(movies["movies"]); //generate dynamic HTML based on the data
            if($("#movies-grid").length==0){
                $("#movies-list").html(html);
            }else {
                $("#movies-grid").html(html);
            }

    });
    $("#list_icon").on('click', function(){

        $("#movies-grid").attr("id", "movies-list");
        $("#list_icon").attr("src", "images/list_pressed.jpg");
        $("#grid_icon").attr("src", "images/grid.jpg");

    });
    $("#grid_icon").on('click', function(){

        $("#movies-list").attr("id", "movies-grid");
        $("#list_icon").attr("src", "images/list.jpg");
        $("#grid_icon").attr("src", "images/grid_pressed.jpg");

    });
});