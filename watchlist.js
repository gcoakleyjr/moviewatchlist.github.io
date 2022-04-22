import {renderMovieList, getMovieHtml} from './index.js'

let watchlistLocalStorage = JSON.parse(localStorage.getItem("watchlist"))

//document.querySelector(".to-film-btn").addEventListener("click", function() {
//    
//})

if (watchlistLocalStorage.length > 0) {
    document.querySelector(".watch-list-empty").style.display = "none"
    const watchListContainer = document.querySelector(".watchlist-results")
    await renderMovieList(watchlistLocalStorage, watchListContainer)
    let removeBtn = document.querySelectorAll(".add-remove-btn") 
    removeBtn.forEach(btn => btn.addEventListener("click", async function() {
        const updatedWatchListLS = JSON.parse(localStorage.getItem("watchlist"))
        
        await renderMovieList(updatedWatchListLS, watchListContainer)
        removeBtn = document.querySelectorAll(".add-remove-btn")
        console.log(removeBtn)
    }))
    
} else {
    console.log(watchlistLocalStorage)
}




