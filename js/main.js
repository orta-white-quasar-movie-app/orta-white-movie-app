"use strict"
$(document).ready(function(){
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
                    html += `<div><h2 >${movie.title}</h2><img style="width: 150px" src="${movie.poster}"><p>${movie.year}, ${movie.genre}</p><p>Actors: ${movie.actors}</p><p>Plot: ${movie.plot}</p><p>Rating: ${movie.rating}</p></div><div><button class="delete" data-id="${movie.id}">Delete</button></div><div><button class="button btn-primary edit-button" data-id="${movie.id}">EDIT?</button></div>`
                    $("#movie-div").html(html);
                    //Deletes Each Movie
                    $(".delete").click(function(){
                            deleteMovie($(this).data("id"))
                        });

                })
            }).then(function (){
                $("#user-movies").click(function(){
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
    $(document).on("click", ".edit-button", function(){
        let id = $(this).attr("data-id")
        $('#isThisWorking').modal('show')
        fetch(`${API_URL}/${id}`)
            .then((response) => response.json())
            .then(movie => {
                $("#title-edit").val(movie.title)
                $("#rating-edit").val(movie.rating)
            })

        // editMovie($(this).data("id"))
    });
//when they click submit #save-changes, run the editMovie function
    $("#save-changes").click(function(){
    function editMovie(edit) {
        let options = {
            method: 'PUT',       //use put to edit the movie, we are not creating a new one
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(edit)    //what is body. body is referring to the body of the request
        }
        return fetch(`${API_URL}/${movie.id}`, options)
            .then((response)=>response.json())
    }
    })
    //editMovie(movie).then((data)=>console.log(data))



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

//copied from bootstrap modal page
// $(".edit-movie").click(function(){
//     $('#userEditModal').on('shown.bs.modal', function (event) {
//         var button = $(event.relatedTarget) // Button that triggered the modal
//         var recipient = button.data('whatever') // Extract info from data-* attributes
//         // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
//         // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
//         var modal = $(this)
//         modal.find('.modal-title').text('New message to ' + recipient)
//         modal.find('.modal-body input').val(recipient)
//         modal.find(".modal-body textarea").val("enter text")
//     })
// })


// function EditMovies() {
//     var html = "";
//     var msg = document.getElementById('movie-edit-box');
//     return fetch(API_URL)
//         .then(function (response) {
//             return response.json();
//         }).then(function (resultsObject) {
//             console.log(resultsObject);
//             var catalog = document.getElementById('select');
//             for (var i = 0; i < resultsObject.length; i++) {
//                 // POPULATE SELECT ELEMENT WITH JSON.
//                 catalog.innerHTML +=
//                     '<option value="' + resultsObject[i].id + '">' + resultsObject[i].title + '</option>';
//
//                 msg.innerHTML = 'Selected Movie: <b>' + catalog.options[catalog.selectedIndex].text + '</b>' +
//                     'ID: <b>' + catalog.value + '</b>';
//             }
//         });
// }
//
// EditMovies();


// //Edit the Movies Button
//     const paragraph = document.getElementById("edit");
//     const edit_button = document.getElementById("edit-button");
//     const end_button = document.getElementById("end-editing");
//
//     edit_button.addEventListener("click", function() {
//         paragraph.contentEditable = true;
//         paragraph.style.backgroundColor = "#dddbdb";
//     } );
//
//     end_button.addEventListener("click", function() {
//         paragraph.contentEditable = false;
//         paragraph.style.backgroundColor = "#ffe44d";
//     } )
// function deleteDog(id){
//     let options = {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     }
//     fetch(`${API_URL}/${id}, options`)
//         .then((response) => console.log("deleted dog"))
// }
//.then(function(response) {
// console.log("deleted dog")
//}


//Create dog
// function createDog(dog) {
//     let options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dog)
//     }
//     return fetch(API_URL, options)
//         .then((response)=>response.json())
// }
// let charlie = {
//     name: 'Charlie',
//     isGoodDog: false,
//     age: 8
// }
//createDog(charlie).then((newDog)=>console.log(newdog));




//*** Notes from Fridays lecture ***
//const API_URL = "https://vagabond-glacier-verse.glitch.me/dogs";

// function getDogs(){
//     return fetch(API_URL)
//         .then((response) => response.json());
// }
//
// function getDog(id){
//     return fetch(`${API_URL}/${id}`)
//         .then((response)=> response.json())
// }
//in the console, the user would type getDog(11).then((dog)=>console.log(dog))

//Edit dog by ID
// function editDog(dog) {
//     let options = {
//         method: 'PUT',       //use put to edit the dog, we are not creating a new one
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dog)    //what is body. body is referring to the body of the request
//     }
//     return fetch(`${API_URL}/${dog.id}`, options)
//         .then((response)=>response.json())
// }
// let piper = {
//     name: 'Piper',
//     isGoodDog: false,
//     id: 11,
//     age: 8
// }

//editDog(piper).then((data)=>console.log(data))



