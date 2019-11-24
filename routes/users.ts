import axios from 'axios';
import { log } from '../helpers/log';
import { connectToDb, getDataFromDB } from '../helpers/db';
import cache from '../cache';
import config from '../config.json';

/**
 * Returns all users.
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await getDataFromDB('users');
        res.status(200).send(users);
    }
    catch (err) {
        res.status(err.code).send(err);
    }
}

/**
 * Returns particular user's data.
 * @param req.params.steamid
 */
export const getUser = async (req, res) => {
    try {
        const user = await getDataFromDB('users', { id: req.params.steamid });
        res.status(200).send(user);
    }
    catch (err) {
        res.status(err.code).send(err);
    }
}

const getUserGames = (userID:number, curatedGames:any, userToUpdate:any) => new Promise(async (resolve, reject) =>{
    log.INFO(`--> [UPDATE] games of user ${userID}`);

    const userGamesUrl = `https://steamcommunity.com/profiles/${userID}/games/?tab=all`;
    const userGamesFallbackUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${config.STEAM_KEY}&steamid=${userID}`;
    let userGames;
    let userGamesFallback;
    let games;

    userGames = await axios.get(userGamesUrl);
    userGamesFallback = await axios.get(userGamesFallbackUrl);

    if (!userGames.data && !userGamesFallback.data) {
        log.INFO(`- user ${ userID} has their profile set to private`)
        resolve([ ]);
        return;
    }

    games = userGames.data.substring((userGames.data.indexOf('rgGames =')) + 9);
    games = games.substring(0, games.indexOf('];')+1).trim();
    try {
        games = JSON.parse(games);
    }
    catch(err) {
        if (userGamesFallback.data.response.games) {
            log.INFO(`--> [UPDATE] game list [FALLBACK]`)
            games = userGamesFallback.data.response.games;
        }
        else {
            log.INFO(`- user ${ userID} has their profile set to private`)
            resolve([ ]);
            return;
        }
    }

    games = games.filter(game => !!curatedGames.find(cachedgame => cachedgame.id == game.appid))
        .map(game => {
            return {
                appid: game.appid,
                playtime_forever: game.hours_forever 
                    ? game.hours_forever.replace(',', '') 
                    : game.playtime_forever
                        ? game.playtime_forever / 60
                        : 0
            }
        })
    try {
        resolve(await getUserAchievements(userID, games, userToUpdate));
    }
    catch(err) {
        resolve([ ])
    }    
    return;
})

const getUserAchievements = (userID:number, games:object, userToUpdate:any) => new Promise((resolve, reject) => {
    log.INFO(`--> achievements of user ${ userID }`);

    const getAchievementsDetails = async (index:number) => {
        let gameID = games[index].appid;
        let url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${ gameID }&steamid=${ userID }&key=${ config.STEAM_KEY }&format=json`;
        let response;

        log.INFO(`-- [${index+1}/${Object.keys(games).length}] game ${ gameID } (user ${userID})`);

        const updateIndex = cache.updating.findIndex(user => user.user === userID);
        if (updateIndex && cache.updating[updateIndex])
            cache.updating[updateIndex].progress = 100*(index+1)/Object.keys(games).length;

        try {
            response = await axios.get(url);

            let numberOfAllAchievements = response.data.playerstats.achievements.length;
            let numberOfUnlockedAchievements = response.data.playerstats.achievements.filter(achievement => achievement.achieved == 1).length;
            let lastUnlocked = 0;
            response.data.playerstats.achievements.map(achievement => 
                achievement.unlocktime > lastUnlocked
                    ? lastUnlocked = achievement.unlocktime
                    : null
            )
            let completionRate = 100*numberOfUnlockedAchievements/numberOfAllAchievements;
            
            games[index].completionRate = completionRate;
            games[index].lastUnlocked = lastUnlocked;

            // event when 100%
            if (userToUpdate[0]) { //this user is not in database YET
                const userGames = userToUpdate[0].games.find(g => g.appid === gameID)
                if (userGames && (userGames.completionRate !== 100 && completionRate === 100)) {
                    log.INFO(`--> [UPDATE] events - user ${userID} completed ${gameID}`)
                    const eventDetails = {
                        date: lastUnlocked * 1000,
                        type:'complete',
                        member: userID,
                        game: gameID
                    }
                    const { client, db } = await connectToDb();
                    db.collection('events').insertOne(eventDetails, (err, data) => { });
                }
            }
        }
        catch (err) {
            log.WARN(`--> [${index+1}/${Object.keys(games).length}] game ${ gameID } (user ${userID}) - [ERROR] - ${ url }`);
            log.WARN(err);
            if (games[index+1]) {
                setTimeout(() => getAchievementsDetails(index + 1), config.DELAY);
                return;
            }
            else {
                log.INFO(`--> [UPDATE] achievements for ${ userID } [DONE]`);
                resolve(games);
                return;
            }
        }

        if (games[index+1]) {
            setTimeout(() => getAchievementsDetails(index + 1), config.DELAY);
        }
        else {
            log.INFO(`--> [UPDATE] achievements for ${ userID } [DONE]`);
            resolve(games);
        } 
    }
    getAchievementsDetails(0);
})

const getUserRanking = (curatedGames, userGames) => new Promise(async(resolve, reject) => {
    let ranking = { };
    let rating;
    try {
        rating = await getDataFromDB('points');
    } 
    catch(err) {
        resolve(ranking)
    }
    rating.map(tier => ranking[tier.id] = 0);

    userGames
        .filter(game => game.completionRate == 100)
        .map(filteredgame => {
            let game = curatedGames.find(cachedgame => cachedgame.id == filteredgame.appid);
            game && ranking[game.rating]
                ? ranking[game.rating] += 1
                : ranking[game.rating] = 1;
        })
    resolve(ranking)
})

/**
 * Updates one particular user data.
 * @param req.params.steamid 
 */
export const updateUser = async (req, res) => { // TODO remove badges that dont exist anymore
    const curatedGames = await getDataFromDB('games');
    const userToUpdate = await getDataFromDB('users', { id: req.params.steamid });
    const userUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.STEAM_KEY}&steamids=${req.params.steamid}`;
    const { client, db } = await connectToDb();
    let userData;

    try {
        log.INFO(`--> [UPDATE] user ${req.params.steamid} [START]`)
        userData = await axios.get(userUrl);
    }
    catch(err) {
        res.status(err.code).send(err);
        log.WARN(`--> [UPDATE] user ${req.params.steamid} [ERROR]`);
        log.WARN(err);
        return;
    }
    if (!userData || !userData.data || !userData.data.response || !userData.data.response.players) {
        res.status(500).send('Cannot update, retry in a few minutes');
        log.WARN(`--> [UPDATE] updating user ${req.params.steamid} [ERROR]`);
        return; 
    }
    if (userToUpdate[0] && userToUpdate[0].updated && Date.now() - userToUpdate[0].updated < 3600000) {
        res.status(202).send(`This user had been updated less than an hour ago`);
        log.WARN(`--> [UPDATE] updating user ${req.params.steamid} [INTERRUPTED]`);
        return;
    }
    if (cache.updating.length >= 4) {
        res.status(202).send('Too many users are updating now - retry in a few minutes');
        log.WARN(`--> [UPDATE] updating user ${req.params.steamid} [INTERRUPTED]`);
        return;
    }
    if (cache.updating.find(updating => updating.user === req.params.steamid)) {
        res.status(202).send('This user is already being updated');
        log.WARN(`--> [UPDATE] updating user ${req.params.steamid} [INTERRUPTED]`);
        return;
    }
    res.status(202).send('Updating... refresh in a few minutes');
    cache.updating.push({
        user: req.params.steamid,
        progress: 0
    })

    const gamesAsync = await getUserGames(req.params.steamid, curatedGames, userToUpdate);
    const rankingAsync = await getUserRanking(curatedGames, gamesAsync); 

    userData = userData.data.response.players[0];
    let user = { 
        id: req.params.steamid,
        name: userData.personaname,
        avatar: userData.avatarfull,
        url: `https://steamcommunity.com/profiles/${req.params.steamid}`,
        games: gamesAsync,
        ranking: rankingAsync,
        badges: userToUpdate[0] ? userToUpdate[0].badges : [],
        // @ts-ignore:next-line
        private: gamesAsync.length === 0 ? true : false,
        updated: Date.now(),
        // member: false // TODO check if Steam user is member!!!
    };

    db.collection('users').updateOne({ id: req.params.steamid }, {$set: user}, { upsert: true }, (err, data) => {
        if (err) {
            log.WARN(`--> [UPDATE] user ${req.params.steamid} [ERROR]`)
            log.WARN(err);
        }
        else {
            const index = cache.updating.findIndex(user => user.user === req.params.steamid);
            const newCache = cache.updating.splice(index, 1);
            cache.updating = newCache;
            log.INFO(`--> [UPDATE] user ${req.params.steamid} [DONE]`)
        }
    });
    client.close();
}