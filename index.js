const movieTitle = document.querySelector(".title")
const movieRating = document.querySelector(".movie-rating")
const runTime = document.querySelector(".run-time")
const genre = document.querySelector(".genre")
const plot = document.querySelector(".plot")
const searchInput = document.querySelector("input")

const clickOpen = document.querySelector(".click-to-open")
const searchSection = document.querySelector(".search-section")
const toWatchlistBtn = document.querySelector(".watchlist-btn")
const headerAnimate = document.querySelector("header")
let onPage = true

let watchlistLocalStorage = JSON.parse(localStorage.getItem("watchlist"))


// CHECK IF ON FIRST PAGE
if (document.querySelector(".search-btn")) {
    document.querySelector(".search-btn").addEventListener("click", searchMovies)

    // PAGE OPEN ANIMATION
    if (!onPage) {
        clickOpen.addEventListener("click", function () {
            searchSection.classList.remove("opacity")
            toWatchlistBtn.classList.remove("opacity")
            headerAnimate.classList.remove("open-element")
            onPage = true
        })
    } else {
        searchSection.classList.remove("opacity")
        toWatchlistBtn.classList.remove("opacity")
        headerAnimate.classList.remove("open-element")
    }
}


// SEARCH MOVIE
async function searchMovies() {
    if (!searchInput.value) {
        console.log("nothing")
    } else {
        document.querySelector(".start-exploring").style.display = "none"
        const searchListContainer = document.querySelector(".search-results")

        const response = await fetch(`https://www.omdbapi.com/?apikey=8a7aad17&s=${searchInput.value}&type=movie&plot=short`)
        try {
            const data = await response.json()
            let movieObj = data.Search
            let movieSorted = movieObj.sort((a, b) => parseFloat(b.Year) - parseFloat(a.Year))
            let movieImdbID = movieSorted.map(val => val.imdbID)

            renderMovieList(movieImdbID, searchListContainer, "add")
            searchInput.value = ""
        } catch (err) {
            searchListContainer.innerHTML = ""
            document.querySelector(".start-exploring").style.display = "block"
            document.querySelector(".start-exploring").innerHTML = "<p>Unable to find what you're searching for. Please try another search.</p>"
        }
    }
}

async function renderMovieList(movieSearch, movieContainer, buttonstate) {
    //RENDER SEARCH TO DOM
    let fetchedMovieID = []

    let container = ""
    for (let movie of movieSearch) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=8a7aad17&i=${movie}`)
        const data = await response.json()
        fetchedMovieID.push(data.imdbID)
        container += getMovieHtml(data, buttonstate)
    }
    movieContainer.innerHTML = container

    //CHECK IF MOVIE IS ALREADY IN WATCHLIST ON RENDER
    const addRemoveBtn = document.querySelectorAll(".add-remove-btn")
    const watchListImg = document.querySelectorAll(".add-remove-img")
    const movieID = document.querySelectorAll(".imdbID")
    let watchListArray = []

    if (watchlistLocalStorage) {
        watchListArray = watchlistLocalStorage
        for (let i = 0; i < fetchedMovieID.length; i++) {
            if (watchlistLocalStorage.includes(fetchedMovieID[i])) {
                watchListImg[i].src = "img/RemoveIcon.png"
            }
        }
    }


    //ADD AND REMOVE MOVIES TO WATCHLIST  
    addRemoveBtn.forEach((btn, index) => btn.addEventListener("click", function () {
        //ADD TO WATCH LIST             
        if (watchListImg[index].classList.contains("add")) {
            console.log("add")

            watchListImg[index].src = "img/RemoveIcon.png"
            watchListImg[index].classList.remove("add")
            watchListImg[index].classList.add("remove")

            watchListArray.push(movieID[index].innerHTML)
            localStorage.setItem("watchlist", JSON.stringify(watchListArray))
        }
        //REMOVE FROM WATCH LIST
        else if (watchListImg[index].classList.contains("remove")) {
            console.log("remove")
            watchListImg[index].src = "img/AddIcon.png"
            watchListImg[index].classList.remove("remove")
            watchListImg[index].classList.add("add")

            let removeIndex = watchListArray.indexOf(movieID[index].innerHTML)
            if (index > -1) {
                watchListArray.splice(removeIndex, 1)
            }
            localStorage.setItem("watchlist", JSON.stringify(watchListArray))
        } else {
            console.log(watchListImg[index].src)
        }
    }))

    function renderRemove() {

    }
}

function getMovieHtml(movie, button) {
    if (movie.Poster === "N/A") {
        movie.Poster = "img/noposter.jpg"
    }

    let html = `
                        <div class="movie-list">                           
                            <img src="${movie.Poster}" class="movie-image">                          
                            <div class="movie-description">      
                                <div class="movie-heading">
                                    <h2 class="title">${movie.Title}</h2>
                                    <span class="movie-rating">⭐ ${movie.imdbRating}</span>
                                </div>
                                
                                <div class="movie-info">
                                    <span class="run-time">${movie.Year}</span>
                                    <span class="genre">${movie.Genre}</span>
                                    <button class="add-remove-btn">
                                    <img src="img/AddIcon.png" class="add-remove-img ${button}"> Watchlist</button>
                                </div>
                                
                                <p class="plot">${movie.Plot}</p>
                                <div class="imdbID">${movie.imdbID}</div>                              
                            </div>             
                        </div>
                        <hr>
   `

    return html
}


//CHECK IF ON SECOND PAGE
if (!document.querySelector(".search-btn")) {

    //LOAD WATCHLIST, IF NOT, HAD WATCHLIST EMPTY TEXT   
    if (watchlistLocalStorage.length > 0) {
        document.querySelector(".watch-list-empty").style.display = "none"
        const watchListContainer = document.querySelector(".watchlist-results")
        await renderMovieList(watchlistLocalStorage, watchListContainer, "remove")

        //REMOVE ITEMS FROM WATCH LIST
        //let removeBtn = document.querySelectorAll(".add-remove-btn") 
        //removeBtn.forEach(btn => btn.addEventListener("click", async function() {
        //    const updatedWatchListLS = JSON.parse(localStorage.getItem("watchlist"))
        //    
        //    await renderMovieList(updatedWatchListLS, watchListContainer)
        //    removeBtn = document.querySelectorAll(".add-remove-btn")
        //    console.log(removeBtn)
        //}))

    } else {
        console.log(watchlistLocalStorage)
    }
}




//export {renderMovieList, getMovieHtml}







