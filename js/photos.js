$( document ).ready(function() {
    var show=false;//for showing suggestions
    var movies;
    /**
     * TWO NESTED AJAX CALLS
     * FIRST TO LOAD JSON DATA, AND THE SECOND TO LOAD THE HTML FOR EACH SINGLE MOVIE
     */
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
            //LISTENING TO THE TEXT INPUT
            $("#search-input").on('keyup',function(){
                 suggestions = live_search();
                    console.log(suggestions);



             });
            //LISTENING TO THE SEARCH BUTTON TO APPLY THE LIVE SEARCH
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

    /**
     * FUNCTION USED TO SORT CURRENT DISPLAYED MOVIES BY YEAR
     * @param template: the html template of photo.
     * @param suggestion: the current displayed suggestions.
     * **/
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

    /**
     * FUNCTION USED TO SORT CURRENT DISPLAYED MOVIES BY RATING
     * @param template: the html template of photo.
     * @param suggestion: the current displayed suggestions.
     * **/
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
    /***
     * function to display the current movies
     * @param template: HTML template of photo
     * @param movies: suggested movies
     */
    function display(template, movies){
        var html_maker = new htmlMaker(template); //create an html Maker
        var html = html_maker.getHTML(movies); //generate dynamic HTML based on the data
        if($("#movies-grid").length==0){
            $("#movies-list").html(html);
        }else {
            $("#movies-grid").html(html);
        }
    }

    /***
     * Live_search
     * functionality for live search. It suggests as the user writes the
     * name, year, starrings, rating, .. of the movie
     *
     * @returns {Array of suggested movies}
     */

    function live_search(){

        var value = $("#search-input").val(); //get the value of the text field
        show=false; //don't show suggestions

        //by name
        var html="";
        var suggestions = [];
        $.each(movies["movies"], function (i, val) {
            /**
             * SEARCHING by name, year, starring, rating
             */
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
        ///SHOW THE SUGGESTION BOX IF THERE IS SUGGESTIONS AVAILABLE
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

    /**
     *
     * ADDING LISTENERS TO THE ICONS RESPONSIBLE FOR
     * SWITCHING BETWEEN GRID AND LIST
     */
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