'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 1337;
//----------------------------------------------
const steamKey = process.env.KEY;
const path = `data/data.json`;
let updating = false;
let group = { };


serverStart();
console.log(`Server listens on port ${port}.`);


function serverStart() {
    const createNewServerObject = () => { 
        console.log('Cannot read the data file - creating new server data object...');

        group = {
            lastUpdated: 0,
            groupID: '103582791436640751',
            groupDesc: '',
            groupHead: '',
            memberList: {},
            gameList: {}
        };
    }

    const loadOldServerObject = data => { 
        console.log('Server data file succesfully fetched!');

        try { group = JSON.parse(data); }
        catch(e) { return console.log(e); }
    }

    fs.readFile(path, 'utf8', (err, data) => {
        err ? createNewServerObject() : loadOldServerObject(data)
    })
}

var server = http.createServer((request, response) => {
    var pathName = url.parse(request.url).pathname;

    if (pathName == "/update" && !updating) {
        updating = true;
        
        updateCuratedGames() 
            .then(updateGamesInfo) 
            .then(updateGroupData) 
            .then(updateMemberIDs) 
            .then(updateBasicMemberData) 
            .then(updateMembersOwnedGames) 
            .then(updateMemberAchievements)
            .then(() => finalizeUpdating(response))
            .catch(err => console.log(err));
    }
    else {
        fs.readFile(__dirname + pathName, (err, data) => {
            if (err)
                return responseSend(response, 404, `<h1>404</h1><p>Nie znaleziono strony!</p><p>${JSON.stringify(err)}</p>`);
            if (pathName.indexOf('.json') != -1)
                return responseSend(response, 200, data, {'Content-Type':'application/json'});
            responseSend(response, 200, data);
        });
    }
}).listen(port, "0.0.0.0");

function finalizeUpdating(response) {
    updating = false;
    group.lastUpdated = Date.now();
    responseSend(response, 200, JSON.stringify(group), {'Content-Type':'application/json'});
    fs.writeFile(`data/data.json`, JSON.stringify(group), error => {
        if (error)
            return Promise.reject(`Can't save updated data to file!`);
        console.log(`Update finished!`);
    })
}


function updateCuratedGames() {
    return new Promise((resolve, reject) => {
        const url = `http://store.steampowered.com/curator/7119343-0.1%25/ajaxgetfilteredrecommendations/render/?query=&start=0&count=1000&tagids=&sort=recent&types=0`;
        console.log(`${Date.now()} - call for update`)
        console.log(`1. Updating list of curated games.`); 

        returnRequest(url, data => {
            let helper;
            let games = {};

            if (data == "error") 
                return reject("Error while downloading curated games data!");
            try {
                data = JSON.parse(data.trim());
            }
            catch(e) {
                return reject("ERROR - Couldn't parse the JSON!");
            }
            data = data.results_html;
            data = data.replace(/\r|\n|\t|&quot;/g, "");
            data = data.replace(/\'/g, '"');
            helper = data.split(`<div class="recommendation" >`);

            for (let i in helper) {
                if (helper[i].indexOf(`data-ds-appid`) != -1) {
                    let gameId = helper[i].substring(helper[i].indexOf(`data-ds-appid="`) + `data-ds-appid="`.length, helper[i].indexOf(`" onmouseover`)).trim();
                    let gameDesc = helper[i].substring(helper[i].indexOf(`<div class="recommendation_desc">"`) + `<div class="recommendation_desc">"`.length, helper[i].indexOf(`"</div>`)).trim();
                    let gameRating = 1;

                    if (gameDesc.startsWith("🌟"))
                        gameRating  = 5;
                    if (gameDesc.startsWith("✪"))
                        gameRating  = 3;
                    if (gameDesc.startsWith("☆"))
                        gameRating  = 2;
                    games[gameId] = { "desc": gameDesc, "rating": gameRating };
                    
                    addGameToLogIfNew(gameId);
                }
            }
            return resolve(games);
        });
    })
}


function addGameToLogIfNew(gameId){
	if (!group.gameList.hasOwnProperty(gameId)){
		group.log.push({
			"date":Date.now(),
			"type": "newGame",
			"game": gameId
		});
		console.log(`-- new game detected - adding ${gameId} to log file`);
	}
}


function updateGamesInfo(gamesData) {
    return new Promise((resolve, reject) => {
        const url = `http://store.steampowered.com/api/appdetails?appids=`;
        const gameKeys = Object.keys(gamesData);

        console.log(`2. Updating games data.`)

        const getGameList = id => {
            returnRequest(`${url}${gameKeys[id]}`, data => {
                console.log(`- updating game ${gameKeys[id]} (${parseInt(id) + 1}/${gameKeys.length})`);
                if (data == "error") 
                    return reject(`! Error while updating game ${gameKeys[id]}!`);
                try{
                    data = JSON.parse(data.trim());
                }
                catch(e){
                    return reject("ERROR - Couldn't parse the JSON!");
                }
                gamesData[gameKeys[id]].title = data[gameKeys[id]].data.name;
                gamesData[gameKeys[id]].img = data[gameKeys[id]].data.header_image;
                if (id < gameKeys.length - 1)
                    getGameList(id + 1);
                else {
                    group.gameList = gamesData;
                    return resolve(); // ??? CO TU SIE ZWRACA DO KOLEJNEJ FUNKCJI
                }
            });
        }
        getGameList(0);
    })
}


function updateGroupData() {
    return new Promise((resolve, reject) => {
        const url = `http://steamcommunity.com/gid/${group.groupID}/memberslistxml/?xml=1`;
        let json;

        console.log(`3. Updating guild data.`)

        returnRequest(url, data => {
            if (data == "error")
                return reject("Error while downloading group data!");
            try{
                json = JSON.parse(data);
            }
            catch(e){
                return reject("ERROR - Couldn't parse the JSON!");
            }
            group.groupDesc = json.elements[0].elements[1].elements[3].elements[0].cdata;
            group.groupHead = json.elements[0].elements[1].elements[2].elements[0].cdata;        
            resolve(json.elements[0].elements);
        });
    })
}


function updateMemberIDs(groupDetails) {
    return new Promise((resolve, reject) => {
        let memberList = {};

        console.log(`4. Updating list of guild members.`)

        for (let i in groupDetails) {
            if (groupDetails[i].name == "members") {
                for (let j in groupDetails[i].elements) {
                    var memberId = groupDetails[i].elements[j].elements[0].text;
                    memberList[memberId] = {
                        "name": "",
                        "avatar": "",
                        "games": {},
                        "ranking": {
                            "1": 0,
                            "2": 0,
                            "3": 0,
                            "5": 0
                        }
                    };
                    addMemberToLogIfNew(memberId);
                };
            };
        };
        resolve(memberList);
    })
}


function addMemberToLogIfNew(memberId){
	if (!group.memberList.hasOwnProperty(memberId)){
		group.log.push({
			"date":Date.now(),
			"type": "newMember",
			"player": memberId
		});
		console.log(`-- new member detected - adding ${memberId} to log file`);
	}
}


function updateBasicMemberData(memberList) {
    return new Promise((resolve, reject) => {
        let url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=`;
        for (let id in memberList)
            url += `${id},`;

        console.log(`5. Updating basic details of guild members.`)

        returnRequest(url, data => {
            if (data == "error")
                return reject("Error while downloading members data!")          
            try {
                data = JSON.parse(data);
            }
            catch(e) {
                return reject("ERROR - Couldn't parse the JSON!");
            }
            for (let i in data.response.players) {
                memberList[data.response.players[i].steamid].name = data.response.players[i].personaname;
                memberList[data.response.players[i].steamid].avatar = data.response.players[i].avatarmedium;
            }
            return resolve(memberList);
        });
    });
};


function updateMembersOwnedGames(memberList) {
    return new Promise((resolve, reject) => {
        const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamKey}&steamid=`;
        const memberArray = Object.keys(memberList);

        console.log(`6. Updating list of curated games owned by all guild members.`)

        const iterateThroughMemberOwnedGames = i => {
            const id = memberArray[i];

            returnRequest(`${url}${id}`, data => {
                console.log(`- updating ${id}s games (${parseInt(i)+1}/${memberArray.length})`)
                if (data == "error")
                    return reject(`Error while downloading data of ${id}s owned games!`);
                try {
                    data = JSON.parse(data);
                }
                catch(e) {
                    return reject("ERROR - Couldn't parse the JSON!");
                }

                let memberOwned = data.response.games;
                for (let ownedGame in memberOwned) {
                    for (let curatedGame in group.gameList) {
                        if (memberOwned[ownedGame].appid == curatedGame) {
                            memberList[id].games[curatedGame] = {};
                            memberList[id].games[curatedGame].playtime = memberOwned[ownedGame].playtime_forever;
                            continue;
                        }
                    }
                }
                if (i < memberArray.length - 1)
                    iterateThroughMemberOwnedGames(i+1);
                else
                    return resolve(memberList);
            });
        }
        iterateThroughMemberOwnedGames(0);
    })
}
function updateMemberAchievements(memberList) {
    return new Promise((resolve, reject) => {
        const memberKeys = Object.keys(memberList);

        console.log(`7. Updating achievements of all guild members.`)

        const iterateThroughMemberList = memberIndex => {
            const gameKeys = Object.keys(memberList[memberKeys[memberIndex]].games);

            console.log(`- updating achievements of ${memberKeys[memberIndex]} (${parseInt(memberIndex) + 1}/${memberKeys.length})`);

            const iterateThroughGameList = gameIndex => {
                const url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${gameKeys[gameIndex]}&steamid=${memberKeys[memberIndex]}&key=${steamKey}&format=json`;
                returnRequest(url, data => {

                    console.log(`-- game ${gameKeys[gameIndex]} (${parseInt(gameIndex) + 1}/${gameKeys.length})`);

                    if (data == "error")
                        return reject(`Error while downloading data of ${id}s owned games!`);
                    try {
                        data = JSON.parse(data);
                    }
                    catch(e) {
                        return reject("ERROR - Couldn't parse the JSON!");
                    }
                    if (data.playerstats.success) {
                        let completed = 0;
                        let all = 0;
                        let completionRate = 0;
                        let lastUnlocked = 0;
                        let achievements = data.playerstats.achievements;

                        for (let i in achievements) {
                            if (lastUnlocked < achievements[i].unlocktime)
                                lastUnlocked = achievements[i].unlocktime;
                            if (achievements[i].achieved == 1){
                                completed++;/*
                                if (group.lastUpdated - (achievements[i].unlocktime*1000) <= 604800000) { // if achievement was unlocked within the last week
                                    group.log.push({
                                        "date": achievements[i].unlocktime*1000,
                                        "type": "achievement",
                                        "achievname": achievements[i].apiname,
                                        "player": data.playerstats.steamID,
                                        "game": gameKeys[gameIndex]
                                    });
                                }*/
                            }
                            all++;
                        }
                        completionRate = (completed / all) * 100;
                        if (completionRate == 100){
                            memberList[memberKeys[memberIndex]].ranking[group.gameList[gameKeys[gameIndex]].rating]++;
                            if (group.lastUpdated - (lastUnlocked*1000) <= 604800000) { // if game was 100%'d within the last week
                                group.log.push({
                                        "date": lastUnlocked * 1000,
                                        "type": "complete",
                                        "player": data.playerstats.steamID,
                                        "game": gameKeys[gameIndex]
                                });
                            }
                        }
                        memberList[memberKeys[memberIndex]].games[gameKeys[gameIndex]].completionRate = completionRate;
                        memberList[memberKeys[memberIndex]].games[gameKeys[gameIndex]].lastUnlocked = lastUnlocked;
                    }
                    if (gameIndex < gameKeys.length - 1)
                        iterateThroughGameList(gameIndex + 1);
                    else {
                        if (memberIndex < memberKeys.length - 1)
                            iterateThroughMemberList(memberIndex + 1);
                        else {
                            group.memberList = memberList;
                            return resolve(group);
                        }
                    }
                });
            }
            iterateThroughGameList(0);
        }
        iterateThroughMemberList(0);
    })
}

// FETCH FUNCTIONS
function responseSend(response, code, data, headers) {
	var head = {
		'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*'
	};
	if (headers){
		for (let key in headers){
			head[key]=headers[key];
		}
	}
    response.writeHead(code, head);
    response.write(data);
    response.end();
}
function returnRequest(url, callback) {
    fetchData(url, data => {
        if (data != "error") {
            if (url.indexOf("xml") != -1) {
                var convert = require('xml-js');
                var json = convert.xml2json(data, {});
                callback(json);
                return;
            }
            callback(data);
            return;
        }
        callback(data);
        return;
    });
};
function fetchData(url, callback) {
    require('es6-promise').polyfill();
    require('isomorphic-fetch');

    fetch(url, {
        mode: 'no-cors'
    })
    .then(response => {
        return response.text();
    })
    .then(data => {
        callback(data);
    })
    .catch(error => {
        console.log(error);
        return "error";
    });
};