const axios = require('axios')
const cache = require('../cache/cache')
const rating = require('../data/rating.json')
const api = require('../data/api.json')

const extractRelevantData = data => {
    let games = [ ];
    data
        .replace(/\r|\n|\t|&quot;/g, "")
        .replace(/\'/g, '"')
        .split(`<div class="recommendation" >`)
        .map(rec => {
            if (rec.indexOf(`data-ds-appid`) != -1) {
                let id = rec.substring(rec.indexOf(`data-ds-appid="`) + `data-ds-appid="`.length, rec.indexOf(`" data-ds-tagids`)).trim();
                let desc = rec.substring(rec.indexOf(`<div class="recommendation_desc">"`) + `<div class="recommendation_desc">"`.length,
                    rec.indexOf(`"</div>`)).trim();
                let scoreIsDefined = rating.find(r => desc.startsWith(r.icon))
                let score = scoreIsDefined
                    ? scoreIsDefined.score
                    : 1
                games.push(fillGameData(id, desc, score))                
            }
        })
    return games;
}

const fillGameData = (id, desc, score) => ({
    id: id,
    desc: desc, 
    rating: score   
})

const updateGameIDsList = () => new Promise((resolve, reject) => {
    let date = new Date(Date.now()).toLocaleString();
    const url = api.curatedgames;

    console.log(`${date} - call for update`);
    console.log(`1. Updating list of curated games.`); 

    axios.get(url)
        .then(response => resolve(extractRelevantData(response.data.results_html)))
        .catch(err => reject(err))
})

updateGamesInfo = games => new Promise((resolve, reject) => {
    console.log(`2. Updating games data.`)
    
    const url = api.gamesinfo;
    const requestDate = index => {
        console.log(`--- game ${ parseInt(index)+1 }/${ games.length }`);
        let id = games[index].id;
        addGameToLogIfNew(id);
        
        axios.get(url+id)
            .then(response => {
                if (response.status !== 200)
                    return reject(':c')
                games[index].title = response.data[id].data.name;
                games[index].img = response.data[id].data.header_image;
                return index < games.length - 1
                    ? setTimeout(() => requestDate(index + 1), 50)
                    : resolve(games);
            }).catch(err => reject(err));
    }
    requestDate(0);
})

addGameToLogIfNew = gameId => {
    if (cache.games.filter(game => game.id === gameId).length == 0){
		cache.log.push({
			"date":Date.now(),
			"type": "newGame",
			"game": gameId
		});
		console.log(`---> new game detected - adding ${gameId} to log file`);
    }
}

const update = () => 
    updateGameIDsList()
        .then(updateGamesInfo)

module.exports = update