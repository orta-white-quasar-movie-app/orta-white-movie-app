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
                    html += `<div><h2 >${movie.title}</h2><img style="width: 150px" src="${movie.poster}"><p>${movie.year}, ${movie.genre}</p><p>Actors: ${movie.actors}</p><p>Plot: ${movie.plot}</p><p>Rating: ${movie.rating}</p></div><div><button class="delete" data-id="${movie.id}">Delete</button></div>`
                    //Deletes Each Movie
                    $("#movie-div").html(html);
                        $(".delete").click(function(){
                            deleteMovie($(this).data("id"))
                        });
                })
            })
    }
    getMovies();


    function EditMovies() {
        var html = "";
        var msg = document.getElementById('movie-edit-box');
        return fetch(API_URL)
            .then(function (response) {
                return response.json();
            }).then(function (resultsObject) {
                console.log(resultsObject);
                var catalog = document.getElementById('select');
                for (var i = 0; i < resultsObject.length; i++) {
                    // POPULATE SELECT ELEMENT WITH JSON.
                    catalog.innerHTML +=
                        '<option value="' + resultsObject[i].id + '">' + resultsObject[i].title + '</option>';

                    msg.innerHTML = 'Selected Movie: <b>' + catalog.options[catalog.selectedIndex].text + '</b>' +
                        'ID: <b>' + catalog.value + '</b>';
                }
            });
    }

    EditMovies();


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

    $("#user-movies").click(function(){
        let title = $("#user-entry-title").val();
        let rating = $("#user-entry-rating").val();
        let plot = $("#user-entry-plot").val();
        let actors = $("#user-entry-actor").val();
        let year = $("#user-entry-year").val();
        let genre = $("#user-entry-genre").val();
       createMovies({title, rating, plot, actors, year, genre}).then(function (res){
           console.log(res);
       });
        // console.log(createMovies());
    });
//Allow user to create movie
    function createMovies(movie) {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie)
        }
        return fetch(API_URL, options)
            .then((response) => response.json())
    }

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



