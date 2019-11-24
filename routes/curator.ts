import axios from 'axios';
import { log } from '../helpers/log';
import { connectToDb, getDataFromDB } from '../helpers/db';
import { TGameEvent, TTierChangeEvent } from './types/events';
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
    url?:string,
    sale?: {
        onSale:boolean,
        discount:number
    }
}

const fillGameData = (id, desc, score) => ({
    id: id,
    desc: desc, 
    rating: score   
})

/**
 * Returns all curated games
 */
export const getCuratorGames = async (req?, res?) => { 
    try {
        const games = await getDataFromDB('games');
        if (res)
            res.status(200).send(games);
    }
    catch(err) {
        if (res)
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
export const updateCuratorGames = async (req?, res?) => { 
    const urlCuratedGames = 'http://store.steampowered.com/curator/7119343-0.1%25/ajaxgetfilteredrecommendations/render?query=&start=0&count=1000&tagids=&sort=recent&types=0';
    const points:Array<TRating> = await getDataFromDB('points');
    const gamesDB:Array<TGame> = await getDataFromDB('games');
    let response = await axios.get(urlCuratedGames);
    let games:Array<TGame> = [ ];

    if (!response || !response.data || !response.data.results_html) {
        if (res)
            res.sendStatus(500);
        return;
    }
    if (res)
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
                let id = rec.substring(rec.indexOf(`data-ds-appid="`) + `data-ds-appid="`.length).trim();
                id = id.substring(0, id.indexOf('"')).trim();
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
    */
    if (req && req.headers && !req.headers.force_update)
        games = games.filter((game:TGame) => !gamesDB.find(gameDB => gameDB.id === game.id));
    if (games.length === 0) {
        log.INFO('--> [UPDATE] curated games list [DONE]');
        return;
    }
    const getGameDetails = async (index:number) => {
        const gameId = games[index].id;
        const urlGamesDetails = `http://store.steampowered.com/api/appdetails?appids=${gameId}`;
        const { client, db } = await connectToDb();
        let game;

        try {
            game = await axios.get(urlGamesDetails);
        }
        catch(err) {
            log.INFO(`- saving game ${gameId} failed`);
            log.INFO(`-- ${urlGamesDetails}`);
            log.WARN(err);
            if (games[index+1]) {
                setTimeout(() => getGameDetails(index + 1), config.DELAY)
                return;
            }
            else {
                log.INFO('--> [UPDATE] curated games list [DONE]');
                return; 
            }
        }

        let price = game.data[gameId].data.price_overview;
        const gameDetails:TGame = {
            id: gameId,
            desc: games[index].desc,
            rating: games[index].rating,
            title: game.data[gameId].data.name || 'unknown',
            img: game.data[gameId].data.header_image || 'http://',
            achievements: {
                total: game.data[gameId].data.achievements 
                    ? game.data[gameId].data.achievements.total
                    : 0,
                list: []
            },
            url: urlGamesDetails,
            sale: {
                onSale: price 
                    ? price.discount_percent 
                        ? true 
                        : false
                    : false,
                discount: price
                    ? price.discount_percent
                    : 0
            }
        }

        const oldGame = gamesDB.find(gameDB => gameDB.id === gameId);
        if (oldGame && oldGame.rating !== games[index].rating) {
            log.INFO(`--> [UPDATE] events - game ${gameId} changed tier`)
            const eventDetails:TTierChangeEvent = {
                date: Date.now(),
                type:'tierChange',
                game: gameId,
                oldTier: oldGame.rating,
                newTier: games[index].rating
            }
            db.collection('events').insertOne(eventDetails, (err, data) => { });
        }

        if (!oldGame) {
            const eventDetails:TGameEvent = {
                date: Date.now(),
                type:'newGame',
                game: gameId           
            };
            db.collection('events').insertOne(eventDetails, (err, data) => { });
            log.INFO(`--> [UPDATE] events - game ${gameId} curated`)
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

const extractMemberIDs = raw => {
    const rawMembers = raw
        .toString()
        .substring(
            raw.indexOf("<steamID64>"), 
            raw.indexOf("</members>")
        )
    const memberIDs = rawMembers.split("</steamID64>");
    return memberIDs
        .map(id => {
            const memberID = id
                .replace('</steamID64>', '')
                .replace('<steamID64>', '')
                .replace('\r\n', ''); 
            return {
                name: '',
                avatar: '',
                url: `https://steamcommunity.com/profiles/${memberID}`,
                games: [],
                ranking: [],
                badges: [],
                private: false,
                updated: 0,
                member: true,
                id: memberID
            }
        }).filter(m => m.id.length > 0)
}


export const getCuratorMembers = (req?, res?) => new Promise((resolve, reject) => {
    const url = 'http://steamcommunity.com/gid/7119343/memberslistxml/?xml=1';
    log.INFO('--> [UPDATE] curator members list [START]')
    axios.get(url)
        .then(curator => {
            let members = extractMemberIDs(curator.data);
            resolve(members);
            if (res)
                res.send(members);
            log.INFO('--> [UPDATE] curator members list [DONE]')
        })
        .catch(err => {
            reject(err);
            if (res)
                res.status(500).send(err);
            log.WARN('--> [UPDATE] curator members list [ERROR]')
            log.WARN(err)
        })
})
