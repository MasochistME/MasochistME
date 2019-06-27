import axios from 'axios';
import { log } from '../helpers/log';
import { connectToDb } from '../helpers/db';
import { hash } from '../helpers/hash';
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

const RATE_DELAY = 1000;

const wait = async(data:any) => new Promise(resolve => setTimeout(resolve.bind(null, data), RATE_DELAY))

const fillGameData = (id, desc, score) => ({
    id: id,
    desc: desc, 
    rating: score   
})

const getDataFromDB:any = (dataType:string) => new Promise(async (resolve, reject) => {
    const { client, db } = await connectToDb();
    const data = db.collection(dataType);
    
    data.find({ }).toArray((err, response) => {
        if (err) {
            log.WARN(err);
            client.close();
            reject(err);
        }
        else {
            client.close();
            resolve(response);
        }        
    })
})

export const getCuratorGames = async (req, res) => { 
    try {
        const games = await getDataFromDB('games');
        res.status(200).send(games);
    }
    catch(err) {
        res.status(500).send(err)
    }    
}

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
        downloads current curated games' list 
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
                let scoreIsDefined = points.find(r => desc.startsWith(r.icon))
                let score = scoreIsDefined
                    ? scoreIsDefined.score
                    : 1
                games.push(fillGameData(id, desc, score))                
            }
        })
    games = games.filter((game:TGame) => !gamesDB.find(gameDB => gameDB.id === game.id));

    /*  
        compares it with the games' list saved in database
        games which are not in database are updated now
        [TODO] handling games which got their number of achievements changed
    */
    const getGameDetails = async (index:number) => {
        const gameId = games[index].id;
        const urlGamesDetails = `http://store.steampowered.com/api/appdetails?appids=${gameId}`;
        const game = await axios.get(urlGamesDetails);
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
        db.collection('events').insertOne(eventDetails, (err, data) => { });
        db.collection('games').insertOne(gameDetails, (err, data) => {
            if (err) {
                log.INFO(`- saving game ${gameId} (${gameDetails.title.toUpperCase()}) failed`);
                log.WARN(err);
                client.close();
            }
            else {
                // @ts-ignore:next-line
                log.INFO(`- game ${gameId} (${gameDetails.title.toUpperCase()})`);
                client.close();
            }
            if (games[index+1]) {
                setTimeout(() => getGameDetails(index + 1), 1000);
            }
            else {
                log.INFO('--> [UPDATE] curated games list [DONE]');
            }
        })
    }
    getGameDetails(0);
}
export const getCuratorMembers = (req, res) => {
    const url = 'http://steamcommunity.com/gid/7119343/memberslistxml/?xml=1';
}
