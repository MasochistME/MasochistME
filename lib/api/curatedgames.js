const axios = require('axios')
const api = require('../../config/api.json')
const rating = require('../../config/rating.json')


const extractRelevantData = data => {
    let games = [ ];
    data
        .replace(/\r|\n|\t|&quot;/g, "")
        .replace(/\'/g, '"')
        .split(`<div class="recommendation" >`)
        .map(rec => {
            if (rec.indexOf(`data-ds-appid`) != -1) {
                let id = rec.substring(rec.indexOf(`data-ds-appid="`) + `data-ds-appid="`.length, rec.indexOf(`" onmouseover`)).trim();
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

const updateBasicGamesInfo = () => new Promise((resolve, reject) => {
    console.log(`${Date.now()} - call for update`)
    console.log(`1. Updating list of curated games.`); 
    
    const url = api.curatedgames;        

    axios.get(url)
        .then(response => {
            if (response.status == "error") 
                return reject("Error while downloading curated games data!");
            try {
                let games = extractRelevantData(response.data.results_html);
                return resolve(games);
            }
            catch (e) {
                return reject("Error while downloading curated games data!")
            }
        }).catch(err => reject(err.message));
})

const updateGamesInfo = basicGamesInfo => new Promise((resolve, reject) => {
    console.log(`2. Updating games data.`)

    const url = api.gamesinfo
    const gameIDs = basicGamesInfo.map(game => game.id)    
    let promises = [ ]

    gameIDs.map((id, index) => {
        promises.push(
            axios.get(url+id)
                .then(response => {
                    console.log(`--- game ${index+1}/${gameIDs.length}`)
                    if (response.status == "error") 
                        return reject(`!-- Error while updating game ${id} data!`);
                    return {
                        id: id,
                        title: response.data[id].data.name,
                        img: response.data[id].data.header_image
                    }
                }).catch(err => reject(err.message))
            )
        })    

    const mergeGameData = additionalGamesInfo => new Promise((res, rej) => {
        let merged = basicGamesInfo
            .map(basic => {
                let game = additionalGamesInfo.find(g => g.id == basic.id);
                if (game) {
                    basic.title = game.title.toUpperCase()
                    basic.img = game.img
                }
                return basic
            })
        return res(merged);
    })

    return Promise.all(promises)
        .then(mergeGameData)
        .then(resolve)
        .catch(err => reject(err.message))
})

const update = () => 
    updateBasicGamesInfo()
        .then(updateGamesInfo)

module.exports = update