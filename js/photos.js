$( document ).ready(function() {
    var show=false;//for showing suggestions
    var movies;
    $.ajax({
        url: 'js/data.json',
        data: {},
        dataType: 'json',
        success: function(data){


            movies = data;
            var template_copy;
            //display all movies when click load
            $.get("photo.html", function (template) {
                template_copy = template;
                display(template, movies["movies"]);
                show=false;

            });
            var suggestions=movies["movies"];
            $("#search-input").on('keyup',function(){
                 suggestions = live_search();
                    console.log(suggestions);



             });
            //display the suggestions when click on search
            $("#submit-search").on("click", function(e){
                e.preventDefault();
                suggestions = live_search();
                display(template_copy, suggestions);
                $("#suggestions_box").hide();
            });
            $( "select" ).change(function() {
                if($(this).val()=="year"){
                    sortByYear(template_copy, suggestions);

                }else{
                    sortByRating(template_copy, suggestions);
                }
            });

        }
    });
    function sortByYear(template, suggestions){
        console.log(suggestions);
        suggestions.sort(function(a, b){
            if(a.year== b.year){
                return 0;
            }else if(a.year> b.year){
                return -1;
            }else{
                return 1;
            }
        });
        display(template, suggestions);
    }
    function sortByRating(template, suggestions){
        suggestions.sort(function(a, b){

            if(a.rating== b.rating){
                   return 0;
               } else if(a.rating> b.rating){
                   return -1;
               }else{
                   return 1;
               }
            });

        display(template, suggestions);
    }
    //Function display is responsible for displaying data
    function display(template, movies){
        var html_maker = new htmlMaker(template); //create an html Maker
        var html = html_maker.getHTML(movies); //generate dynamic HTML based on the data
        if($("#movies-grid").length==0){
            $("#movies-list").html(html);
        }else {
            $("#movies-grid").html(html);
        }
    }

    //live search functionality

    function live_search(){

        var value = $("#search-input").val(); //get the value of the text field
        show=false; //don't show suggestions

        //by name
        var html="";
        var suggestions = [];
        $.each(movies["movies"], function (i, val) {
            var start_name = movies["movies"][i].name.toLowerCase().search(value.toLowerCase().trim());
            var start_year = movies["movies"][i].year.toLowerCase().search(value.toLowerCase().trim());
            var start_starring =movies["movies"][i].starring.toLowerCase().search(value.toLowerCase().trim());
            var start_rating = ((movies["movies"][i].rating==value)?1:-1);
            if ((start_name != -1 && value!="" )||(start_year != -1 && value!="" )
                ||(start_starring != -1 && value!="" ) ||(start_rating != -1 && value!="" )) { //if there is a search match

                    suggestions.push( movies["movies"][i]);
                    //console.log(movies["movies"][i]);
                    html += "<div class='sub_suggestions' data-item='" + movies["movies"][i].name + "' >";
                    html += movies["movies"][i].name + "<span class='gray'>"+' ('+movies["movies"][i].year+") " + movies["movies"][i].starring+"</span>";
                    html += "</div>";
                    show=true; //show suggestions
            }
        });
        if(show){
            $("#suggestions_box").html(html);
            //get the children of suggestions_box with .sub_suggestions class
            $("#suggestions_box").children(".sub_suggestions").on('click',function(){
                var item=$(this).attr('data-item'); //get the data
                $("#search-input").val(item); //show it in the field
                $("#suggestions_box").hide(); //hide the suggestion box
            });

            $("#suggestions_box").show();
            show = false;
        }
        else
            $("#suggestions_box").hide();




        return suggestions;
    }
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