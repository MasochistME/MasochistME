import axios from 'axios';
import { log } from '../helpers/log';
import { connectToDb, getDataFromDB } from '../helpers/db';
import config from '../config.json';

type TRating = {
    symbol:string,
    icon:string,
    score:number,
    description:string,
    id:string
}
type TGame = {
    id:string,
    desc:string,
    rating:number
    title?:string,
    img?:string,
    achievements?: {
        total:number,
        list:Array<number>
    },
    url?:string
}
type TGameEvent = {
    date:number,
    type:'newGame',
    game:string
}

const fillGameData = (id, desc, score) => ({
    id: id,
    desc: desc, 
    rating: score   
})

/**
 * Returns all curated games
 */
export const getCuratorGames = async (req, res) => { 
    try {
        const games = await getDataFromDB('games');
        res.status(200).send(games);
    }
    catch(err) {
        res.status(500).send(err)
    }    
}

/**
 * Returns all curated games from particular tier
 * @param req.params.tier
 */
export const getCuratedGamesFromTier = async (req, res) => { 
    try {
        const games = await getDataFromDB('games', { rating: req.params.tier });
        res.status(200).send(games);
    }
    catch(err) {
        res.status(500).send(err)
    }    
}

/**
 * Updates the list of curated games
 * @param req.headers.force_update - to force update all games
 */
export const updateCuratorGames = async (req, res) => { 
    const urlCuratedGames = 'http://store.steampowered.com/curator/7119343-0.1%25/ajaxgetfilteredrecommendations/render?query=&start=0&count=1000&tagids=&sort=recent&types=0';
    const points:Array<TRating> = await getDataFromDB('points');
    const gamesDB:Array<TGame> = await getDataFromDB('games');
    let response = await axios.get(urlCuratedGames);
    let games:Array<TGame> = [ ];

    if (!response || !response.data || !response.data.results_html) {
        res.sendStatus(500);
        return;
    }
    res.status(202).send('Initiated UPDATE on curated games list.');
    log.INFO('--> [UPDATE] curated games list');
    /*
        Downloads current curated games' list.
    */
    response.data.results_html
        .replace(/\r|\n|\t|&quot;/g, "")
        .replace(/\'/g, '"')
        .split(`<div class="recommendation" >`)
        .map(rec => {
            if (rec.indexOf(`data-ds-appid`) != -1) {
                let id = rec.substring(rec.indexOf(`data-ds-appid="`) + `data-ds-appid="`.length, rec.indexOf(`" data-ds-tagids`)).trim();
                let desc = rec.substring(rec.indexOf(`<div class="recommendation_desc">"`) + `<div class="recommendation_desc">"`.length,
                    rec.indexOf(`"</div>`)).trim();
                let scoreIsDefined = points.find(r => desc.trim().startsWith(r.symbol))
                let score = scoreIsDefined
                    ? scoreIsDefined.id
                    : "1"
                games.push(fillGameData(id, desc, score))                
            }
        })
    /*  
        Compares it with the games' list saved in database.
        Games which are not in database are updated now.
        All games get force updated in presence of force_update header.
        TODO handling games which got their number of achievements changed!!!
    */
    if (!req.headers.force_update)
        games = games.filter((game:TGame) => !gamesDB.find(gameDB => gameDB.id === game.id));
    if (games.length === 0) {
        log.INFO('--> [UPDATE] curated games list [DONE]');
        return;
    }
    const getGameDetails = async (index:number) => {
        const gameId = games[index].id;
        const urlGamesDetails = `http://store.steampowered.com/api/appdetails?appids=${gameId}`;
        let game;
        try {
            game = await axios.get(urlGamesDetails);
        }
        catch(err) {
            log.INFO(`- saving game ${gameId} failed`);
            log.WARN(err);
            if (games[index+1])
                setTimeout(() => getGameDetails(index + 1), config.DELAY)
            else {
                log.INFO('--> [UPDATE] curated games list [DONE]');
                return; 
            }
        }
        const gameDetails:TGame = {
            id: gameId,
            desc: games[index].desc,
            rating: games[index].rating,
            title: game.data[gameId].data.name || 'unknown',
            img: game.data[gameId].data.header_image || 'http://',
            achievements: {
                total: game.data[gameId].data.achievements.total,
                list: []
            },
            url: urlGamesDetails
        }
        const eventDetails:TGameEvent = {
            date: Date.now(),
            type:'newGame',
            game: gameId            
        }
        const { client, db } = await connectToDb();
        if (!req.headers.force_update) {
            db.collection('events').insertOne(eventDetails, (err, data) => { });
        }
        db.collection('games').updateOne({id: gameId}, {$set: gameDetails}, { upsert: true }, (err, data) => {
            if (err) {
                // @ts-ignore:next-line
                log.INFO(`- saving game ${gameId} (${gameDetails.title.toUpperCase()}) failed`);
                log.WARN(err);
                client.close();
            }
            else {
                // @ts-ignore:next-line
                log.INFO(`- [${index+1}/${games.length}] - game ${gameId} (${gameDetails.title.toUpperCase()})`);
                client.close();
            }
            if (games[index+1]) {
                setTimeout(() => getGameDetails(index + 1), config.DELAY);
            }
            else {
                log.INFO('--> [UPDATE] curated games list [DONE]');
                return; 
            }
        })
    }
    getGameDetails(0);
}

export const getCuratorMembers = (req, res) => {
    const url = 'http://steamcommunity.com/gid/7119343/memberslistxml/?xml=1';
}
