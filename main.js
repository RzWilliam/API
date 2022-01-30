const topAnime = document.querySelector('#container-top-anime');
const dataAnime = document.querySelector('#container-data-anime');
const userProfile = document.querySelector('#user-anime');
const searchAnime = document.querySelector('#container-search-result');
const choiceButton = document.querySelectorAll('.choice button');
let i = 1;

choiceButton.forEach(button =>{
    button.addEventListener('click', e=>{
        topAnime.innerHTML = "";
        userProfile.style.display = "none"
        searchAnime.style.display = "none"
        topAnime.style.display = "flex"
        choiceButton.forEach(kill=>{
            kill.classList.remove('active')
        })
        e.target.classList.add('active')
    })  
})

function initAnime(sort = 'score',page_value = i){
    searchAnime.style.display = "none"
    userProfile.style.display = "none"
    fetch('https://api.jikan.moe/v3/search/anime?q=&order_by='+ sort +'&sort=desc&page=' + page_value)
    .then(response => response.json())
    .then(data =>{
        data.results.forEach(function(anime){
            let card = document.createElement('div')
            card.className = "anime card"
            card.setAttribute('data-id', anime.mal_id)
            topAnime.appendChild(card)

            let anime_image = document.createElement('img')
            anime_image.src = anime.image_url
            card.appendChild(anime_image)

            let anime_description = document.createElement('div')
            anime_description.innerHTML =
            `<h2>${anime.title}</h2>
            <p>Nb of episodes : ${anime.episodes}</p>
            <p>Release : ${anime.start_date.substr(0, 10)}</p>
            <p>Type : ${anime.type}</p>
            <h3>${sort == 'score' ? `Average score : ${anime.score}` : `Members : ${anime.members}`}</h3>`

            card.appendChild(anime_description)
        })

        document.querySelector('.button-more').innerHTML =`
        <button id="showMore" data-choice="${sort}">Show More</button>`

        document.querySelector('#showMore').addEventListener('click', el =>{
            i += 1
            initAnime(document.querySelector('#showMore').dataset.choice, i)
        })

        document.querySelectorAll('.card.anime').forEach(el =>{
            el.addEventListener('click', e =>{
                initDataAnime(el.dataset.id)
            })
        })
    })
}

// ANIME-DATA ----------------------------------------

function initDataAnime(id){
    topAnime.style.display = "none"
    dataAnime.style.display = "flex"
    userProfile.style.display = "none"
    searchAnime.style.display = "none"
    document.querySelector('#showMore').style.display = "none"
    document.querySelectorAll('.choice').forEach(item =>{
        item.style.display = "none";
    })
    fetch('https://api.jikan.moe/v3/anime/' + id)
    .then(response => response.json())
    .then(data => {
        dataAnime.innerHTML = `
        <div class="anime-data">
            <button id="back-to-anime" onclick="backToTopAnime()">Back to Home</button>
            <div>
                <h3>${data.title}</h3>
                <p class="synopsis">Synopsis : ${data.synopsis}</p>
                <div class ="stats">
                    <ul>
                    <li>Members : ${data.members} (nᵒ ${data.popularity})</li>
                    <li>Score : ${data.score} (nᵒ ${data.rank})</li>
                    <li>Status : ${data.status}</li>
                    ${data.episodes !== null ? `<li>Episodes : ${data.episodes}</li>` : ""}
                    <li>Type : ${data.type}</p>
                    <li>Rating : ${data.rating}</li>
                    </ul>
                </div>
            </div>
            <img src="${data.image_url}">
        </div>`
    })
}

// DATA ANIME -------------------

function backToTopAnime(){
    topAnime.style.display = "flex"
    dataAnime.style.display = "none"
    searchAnime.style.display = "none"
    document.querySelector('#showMore').style.display = "block"
    document.querySelectorAll('.choice').forEach(item =>{
        item.style.display = "flex";
    })
    document.querySelector(".choice button").classList.add('active')
}

// FIN ANIME-DATA ----------------------------------------

// ANIME-USER ----------------------------------------

document.querySelector('#userForm').addEventListener('submit', e=>{
    e.preventDefault()
    i = 1
    let user_value = document.querySelector("#user-input").value;
    choiceButton.forEach(button =>{
        button.classList.remove('active')
    })
    document.querySelectorAll('#watch-choice div').forEach(item=>{
        item.classList.remove('active')
    })
    document.querySelector('#watch-choice div').classList.add('active')
    initUser(user_value)
})

function initUser(user){
    topAnime.style.display = "none"
    dataAnime.style.display = "none"
    searchAnime.style.display = "none"
    document.querySelector('#showMore').style.display = "none"
    userProfile.style.display = "flex"
    document.querySelector('#list-user').innerHTML = "";
    document.querySelector("#data-user").innerHTML = "";
    fetch('https://api.jikan.moe/v3/user/'+ user)
    .then(response => response.json())
    .then(user =>{
        const dataUser = document.querySelector('#data-user')
        dataUser.innerHTML = 
        `
        <h2 class="username">${user.username}</h2>
        <div class="user-infos">
            <div class="user-image">
                ${user.image_url !== null ? `<img src='${user.image_url}' alt="Profile picture of ${user.username}"> ` : "<img src='https://images.assetsdelivery.com/compings_v2/pavelstasevich/pavelstasevich1902/pavelstasevich190200120.jpg'>"}
            </div>
            <div class="user-anime-stats">
                <h2>Average Score : ${user.anime_stats.mean_score}</h2>
                <ul>
                    <li>Watching : ${user.anime_stats.watching}</li>
                    <li>Completed: ${user.anime_stats.completed}</li>
                    <li>On Hold : ${user.anime_stats.on_hold}</li>
                    <li>Dropped : ${user.anime_stats.dropped}</li>
                    <li>Plan to Watch : ${user.anime_stats.plan_to_watch}</li>
                </ul>
            </div>
        </div>
        <h2 class="favorite-title">Favorites :</h2>
        <div class="favorites" id="favorites">           
        </div>
        `
        const favorites = document.querySelector('#favorites')
        user.favorites.anime.forEach(favorite =>{
            favorites.innerHTML += `
            <div class="mini-card">
                <img src="${favorite.image_url}" alt="${favorite.name}">
            </div>`
        })
    })

    initUserAnimeList(user)
}

function initUserAnimeList(user, sort = "watching", page = i){
    const userList = document.querySelector('#list-user');
    userList.innerHTML=""
    fetch('https://api.jikan.moe/v3/user/'+ user + '/animelist/' + sort + '/' + page )
    .then(response => response.json())
    .then(users =>{
        users.anime.forEach(anime =>{
            userList.innerHTML += `
            <div class="card anime" data-id="${anime.mal_id}">
                <img src="${anime.image_url}" alt="${anime.title}">
                <div class="description">
                    <h2>${anime.title}</h2>
                    <p>Viewed episodes : ${anime.watched_episodes} / ${anime.total_episodes === 0 ? "Not defined yet" : `${anime.total_episodes}`}</p>
                    <p>Type : ${anime.type}</p>
                    <h3>${anime.score !== 0 ? `${user}'s score : ${anime.score}` :"Not scored yet"}</h3>
                </div>
            </div>
            `
            document.querySelectorAll('.card.anime').forEach(el =>{
                el.addEventListener('click', e =>{
                    initDataAnime(el.dataset.id)
                })
            })  
        })

        if(document.querySelectorAll('#user-anime .card.anime').length> 299){   
            document.querySelector('#next-page').innerHTML = `
            <button onclick="initUserAnimeList('${user}', '${sort}', ${page+1})">Next Page</button>` 
            
        } else{
            document.querySelector('#next-page').innerHTML = ""
        }

        if(page > 1){
            document.querySelector('#previous-page').innerHTML = `
            <button onclick="initUserAnimeList('${user}', '${sort}', ${page-1})">Previous Page</button>`
        }   else{
            document.querySelector("#previous-page").innerHTML = "";
        }
    })
}

document.querySelectorAll('#watch-choice div').forEach(item=>{
    item.addEventListener('click', e=>{
        document.querySelectorAll('#watch-choice div').forEach(kill=>{
            kill.classList.remove('active')
        })
        e.target.classList.add('active');
        let value = item.dataset.choice;
        let user = document.querySelector('.username').innerHTML
        initUserAnimeList(user, value); 
    })
})

// END ANIME-USER ----------------------------------------

// SEARCH ANIME --------------------------------

document.querySelector('#searchForm').addEventListener('submit', e =>{
    e.preventDefault()

    choiceButton.forEach(button =>{
        button.classList.remove('active')
    })

    dataAnime.style.display = "none";
    topAnime.style.display = "none";
    userProfile.style.display = "none";
    searchAnime.style.display = "flex"
    document.querySelector('#showMore').style.display = "none"

    const searchResult = document.querySelector('#container-search-result')
    searchResult.innerHTML = ""
    let value = document.querySelector('#searchInput').value

    fetch('https://api.jikan.moe/v3/search/anime?q=' + value)
    .then(response => response.json())
    .then(search =>{
        search.results.forEach(result =>{
            searchResult.innerHTML += `
            <div class="card anime" data-id="${result.mal_id}">
                <img src="${result.image_url}" alt="${result.title}">
                <div>
                    <h2>${result.title}</h2>
                    <p>Nb of episodes : ${result.episodes}</p>
                    <p>Score : ${result.score}</p>
                    <p>Rated : ${result.rated}</p>
                    <p>Type : ${result.type}</p>
                    <h3>Members : ${result.members}</h3>
                </div>
            </div>`
        })

        document.querySelectorAll('.card.anime').forEach(el =>{
            el.addEventListener('click', e =>{
                initDataAnime(el.dataset.id)
            })
        })
    })
})

// END SEARCH ANIME ----------------------------

initAnime()

// END ANIME ---------------------------------

// SWITCH MANGA-ANIME ------------------------

document.querySelectorAll('.category').forEach(item=>{
    item.addEventListener("click", function(){
        document.querySelectorAll('.category').forEach(kill=>{
            kill.classList.remove('active')         
        })
        this.classList.add('active')

        if(document.querySelector('.manga-category').classList.contains('active')){
            document.querySelector('#manga-all').style.display = "block";
            document.querySelector('#anime-all').style.display = "none";
        } else{
            document.querySelector('#anime-all').style.display = "block";
            document.querySelector('#manga-all').style.display = "none";
        }
    })
})

// MANGA -------------------------------------

const mangaMain = document.querySelector('#container-main-manga')
const mangaData = document.querySelector('#container-data-manga')

document.querySelectorAll('.manga-choice button').forEach(button=>{
    button.addEventListener('click', e=>{
        document.querySelectorAll('.manga-choice button').forEach(kill=>{
            kill.classList.remove('active')
        })
        e.target.classList.add('active')
    })
})

function initManga(sort ='-averageRating', page = 0){
    mangaMain.innerHTML = ""
    fetch('https://kitsu.io/api/edge/manga?sort=' + sort + '&page[limit]=20&page[offset]=' + page)
    .then(response => response.json())
    .then(data=>{
        data.data.forEach(manga=>{
            mangaMain.innerHTML +=`
            <div class="card manga" data-id="${manga.id}">
                <img src="${manga.attributes.posterImage.small}">
                <div>
                    <h2>${manga.attributes.canonicalTitle}</h2>
                    <p>Status : ${manga.attributes.status}</p>
                    ${manga.attributes.status === "finished" ? `<p>Nb of Volumes : ${manga.attributes.volumeCount}</p>` : ""}
                    <p>Start Date : ${manga.attributes.startDate}</p>
                    <h3>${sort == '-averageRating' ? `Average score : ${(manga.attributes.averageRating/10).toFixed(2)}` : `Members : ${manga.attributes.userCount}`}</h3>
                </div>
            </div>`
        })

        if(page > 1){
            document.querySelector('.showMore-manga').innerHTML = `
            <button onclick="initManga('${sort}', ${page-20})">Previous Page</button>`
        }   else{
            document.querySelector(".showMore-manga").innerHTML = "";
        }

        document.querySelector('.showMore-manga').innerHTML +=`
        <button id="showMoreManga" onclick="initManga('${sort}', ${page += 20})">Next Page</button>`;

        document.querySelectorAll('.card.manga').forEach(el =>{
            el.addEventListener('click', e =>{
                initDataManga(el.dataset.id)
            })
        })
    })
}

function initDataManga(id){
    mangaData.style.display = "flex"
    mangaMain.style.display = "none"
    document.querySelector('.showMore-manga').style.display = "none";
    document.querySelector('.manga-choice').style.display ="none";
    fetch('https://kitsu.io/api/edge/manga/' + id)
    .then(response => response.json())
    .then(data=>{
        mangaData.innerHTML = `
        <div class="anime-data">
            <button id="back-to-anime" onclick="backToManga()">Back to Home</button>
            <div>
                <h3>${data.data.attributes.canonicalTitle}</h3>
                <p class="synopsis">Synopsis : ${data.data.attributes.synopsis}</p>
                <div class ="stats">
                    <ul>
                    <li>Members : ${data.data.attributes.userCount} (nᵒ ${data.data.attributes.popularityRank})</li>
                    <li>Score : ${(data.data.attributes.averageRating/10).toFixed(2)} (nᵒ ${data.data.attributes.ratingRank})</li>
                    <li>Status : ${data.data.attributes.status}</p>
                    ${data.data.attributes.status === "finished" ? `<li>Volumes : ${data.data.attributes.volumeCount}</li>` : ""}
                    ${data.data.attributes.status === "finished" ? `<li>Chapter : ${data.data.attributes.chapterCount}</li>` : ""}
                    </ul>
                </div>
            </div>
            <img src="${data.data.attributes.posterImage.small}">
        </div>`
    })
}

function backToManga(){
    mangaMain.style.display = "flex"
    mangaData.style.display = "none"
    document.querySelector('.manga-choice').style.display = "flex"
    document.querySelector('.showMore-manga').style.display = "block"
    document.querySelector(".choice button").classList.add('active')
}

initManga()