"use strict"
$(document).ready(function () {
    /** PROGRESS BAR START **/
    var current_progress = 10;
    function moveProgressBar() {
        var interval = setInterval(function () {
            current_progress += 10;
            $("#loadingbar")
                .css("width", current_progress + "%")
                .css({"background-color": "blue", "color": "white"})
                .attr("aria-valuenow", current_progress)
                .text(current_progress + "% Complete")
            if (current_progress >= 100)
                clearInterval(interval);
        }, 1000);
    }
    moveProgressBar();
    //https://codepen.io/gustitammam/pen/RRXGdj

/** PROGRESS BAR END **/
//OUR API'S LIVE HERE
    const API_URL = "https://developing-darkened-sceptre.glitch.me/movies";
    const OMDB_API = "http://www.omdbapi.com/?i=tt3896198&apikey=dce006cf"

    function getMovies() {
        var html = "";
        return fetch(API_URL)
            .then(function (response) {
                return response.json();
            })
            .then(function (resultsObject) {
                console.log(resultsObject)
                resultsObject.forEach(function (movie, index, array) {
                    $("#loadingbar").removeClass("d-flex").addClass("d-none");
//Populates movies in HTML
                    html += `<div class="row"><div class="col-4"><h2 >${movie.title}</h2><img style="width: 150px" src="${movie.poster}"></div><div class="col-8 mt-5"><p>${movie.year}, ${movie.genre}</p><p>Actors: ${movie.actors}</p><p>Plot: ${movie.plot}</p><p>Rating: ${movie.rating}</p></div></div><div class="d-flex mt-2"><div class="d-inline"><button class="delete btn btn-primary mr-2" data-id="${movie.id}">Delete</button></div><div><button class="btn btn-primary edit-button" data-id="${movie.id}">Edit</button></div></div>`
                    $("#movie-div").html(html);
                    //Deletes Each Movie
                    $(".delete").click(function () { //Delete insert to input function to each movie
                        deleteMovie($(this).data("id"))
                    });
                })
            }).then(function () { //Able to search movies using OMDB API
                $("#user-movies").click(function () {
                    var html = "";
                    let title = $("#user-entry-title").val();

                    return fetch(`http://www.omdbapi.com/?t=${title}&apikey=dce006cf`)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (resultsObject) {
                            console.log(resultsObject)
                            let listofMovie = {};
                            listofMovie.rating = resultsObject.imdbRating;
                            listofMovie.title = resultsObject.Title;
                            listofMovie.plot = resultsObject.Plot;
                            listofMovie.actors = resultsObject.Actors
                            listofMovie.year = resultsObject.Year;
                            listofMovie.poster = resultsObject.Poster;
                            listofMovie.genre = resultsObject.Genre
                            console.log(listofMovie)
                            let options = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(listofMovie)
                            }
                            return fetch(API_URL, options)
                                .then((response) => response.json())
                        })
                })
            })
    }
    getMovies();

    //allow user to edit a movie
    $(document).on("click", ".edit-button", function () {
        let id = $(this).attr("data-id")
        $('#isThisWorking').modal('show')
        fetch(`${API_URL}/${id}`)
            .then((response) => response.json())
            .then(movie => {
                let newTitle = $("#title-edit").val(movie.title)
                console.log(newTitle);
                let newRating = $("#rating-edit").val(movie.rating)
                let newID = $('#id-edit').val(movie.id)
                console.log(newRating);
            })
    });

//when they click submit #save-changes, run the editMovie function
    function editMovie(edit) {
        let options = {
            method: 'PATCH',       //use put to edit the movie, we are not creating a new one
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(edit)    //what is body. body is referring to the body of the request
        }
        return fetch(`${API_URL}/${edit.id}`, options)
            .then((response) => response.json())
    }
    //Save changes button inside of our modal
    $("#save-changes").click(function () {
        let newInputs = {}
        // newInputs.id = $(this).data('id')
        newInputs.id = $("#id-edit").val()
        newInputs.title = $("#title-edit").val()
        newInputs.rating = $("#rating-edit").val()
        $('#isThisWorking').modal('hide');
        editMovie(newInputs);
    });

    //Delete Method for 'FOREACH' function to delete
    let deleteMovie = (id) => fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()
    ).then((jsonData) => location.reload())
        .catch(error => console.log(error));
});
// end of document .ready