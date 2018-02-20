'use strict';
var http = require('http');
var url = require('url');
var fs = require('fs');
var port = 1337;
//----------------------------------------------
var steamKey = process.env.KEY;
var updating = false;
var group = {
	lastUpdated: 0,
    groupID: '103582791436640751',
    groupDesc: '',
    groupHead: '',
    memberList: {},
    gameList: {},
	log: []
};

var server = http.createServer((request, response) => {
    var pathName = url.parse(request.url).pathname;

    if (pathName == "/update" && !updating) {
        updating = true;
		group.lastUpdated = Date.now();
        updateCuratedGames(curatedGamesData => {
            updateGamesInfo(curatedGamesData, () => {
                updateGroupData(groupDetails => {
                    updateMemberIDs(groupDetails, memberList => {
                        updateBasicMemberData(memberList, basicMemberList => {
                            updateMembersOwnedGames(basicMemberList, advancedMemberList => {
                                updateMemberAchievements(advancedMemberList, fullMemberList => {
                                    updating = false;
                                    console.log(`Update finished!`);
                                    responseSend(response, 200, JSON.stringify(group), {'Content-Type':'application/json'});
                                    fs.writeFile(`data/data.json`, JSON.stringify(group), error => {
                                        if (error)
                                            console.log(error);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    else {
        fs.readFile(__dirname + pathName, (err, data) => {
            if (err)
                responseSend(response, 404, `<h1>404</h1><p>Nie znaleziono strony!</p><p>${JSON.stringify(err)}</p>`);
            else{
				if (pathName.indexOf('.json')!=-1)
					responseSend(response, 200, data, {'Content-Type':'application/json'});
				else responseSend(response, 200, data);
			}
        });
    }
}).listen(port, "0.0.0.0");
console.log(`Server listens on port ${port}.`);

function updateCuratedGames(callback) {
    var url = `http://store.steampowered.com/curator/7119343-0.1%25/ajaxgetfilteredrecommendations/render/?query=&start=0&count=1000&tagids=&sort=recent&types=0`;
    console.log(`${Date.now()} - call for update`)
    console.log(`1. Updating list of curated games.`); 

    returnRequest(url, data => {
        var helper;
        var games = {};

        if (data == "error") {
            console.log("Error while downloading curated games data!");
            return "error";
        }
        data = JSON.parse(data.trim());
        data = data.results_html;
        data = data.replace(/\r|\n|\t|&quot;/g, "");
        data = data.replace(/\'/g, '"');
        helper = data.split(`<div class="recommendation" >`);

        for (let i in helper) {
            if (helper[i].indexOf(`data-ds-appid`) != -1) {
                var gameId = helper[i].substring(helper[i].indexOf(`data-ds-appid="`) + `data-ds-appid="`.length, helper[i].indexOf(`" onmouseover`)).trim();
                var gameDesc = helper[i].substring(helper[i].indexOf(`<div class="recommendation_desc">"`) + `<div class="recommendation_desc">"`.length, helper[i].indexOf(`"</div>`)).trim();
                var gameRating = 1;

                if (gameDesc.startsWith("🌟"))
                    gameRating  = 3;
                if (gameDesc.startsWith("☆"))
                    gameRating  = 2;
                games[gameId] = { "desc": gameDesc, "rating": gameRating };
            }
        }
        callback(games);
    });
}
function updateGamesInfo(gamesData, callback) {
    var gameArray = '';
    var url = `http://store.steampowered.com/api/appdetails?appids=`;
    var gameKeys = Object.keys(gamesData);

    console.log(`2. Updating games data.`)

    var getGameList = function (id) {
        returnRequest(`${url}${gameKeys[id]}`, data => {
            console.log(`- updating game ${gameKeys[id]} (${parseInt(id) + 1}/${gameKeys.length})`);
            if (data == "error") {
                console.log(`! Error while updating game ${gameKeys[id]}!`);
                return "error";
            }
            data = JSON.parse(data.trim());
            gamesData[gameKeys[id]].title = data[gameKeys[id]].data.name;
            gamesData[gameKeys[id]].img = data[gameKeys[id]].data.header_image;
            if (id < gameKeys.length - 1)
                getGameList(id + 1);
            else {
                group.gameList = gamesData;
                return callback();
            }
        });
    }
    getGameList(0);
}
function updateGroupData(callback) {
    var url = `http://steamcommunity.com/gid/${group.groupID}/memberslistxml/?xml=1`;

    console.log(`3. Updating guild data.`)

    returnRequest(url, data => {
        if (data == "error") {
            console.log("Error while downloading group data!");
            return "error";
        }
        var json = JSON.parse(data);
        group.groupDesc = json.elements[0].elements[1].elements[3].elements[0].cdata;
        group.groupHead = json.elements[0].elements[1].elements[2].elements[0].cdata;        
        callback(json.elements[0].elements);
    });
}
function updateMemberIDs(groupDetails, callback) {
    var memberList = {};

    console.log(`4. Updating list of guild members.`)

    for (let i in groupDetails) {
        if (groupDetails[i].name == "members") {
            for (let j in groupDetails[i].elements) {
                memberList[groupDetails[i].elements[j].elements[0].text] = {
                    "name": "",
                    "avatar": "",
                    "games": {},
                    "ranking": {
                        "1": 0,
                        "2": 0,
                        "3": 0,
                    }
                };
            };
        };
    };
    callback(memberList);
}
function updateBasicMemberData(memberList, callback) {
    var url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=`;
    for (let id in memberList)
        url += `${id},`;

    console.log(`5. Updating basic details of guild members.`)

    returnRequest(url, data => {
        if (data == "error") {
            console.log("Error while downloading members data!");
            return "error";
        }
        data = JSON.parse(data);
        for (let i in data.response.players) {
            memberList[data.response.players[i].steamid].name = data.response.players[i].personaname;
            memberList[data.response.players[i].steamid].avatar = data.response.players[i].avatarmedium;
        }
        callback(memberList);
    });
};
function updateMembersOwnedGames(memberList, callback) {
    var url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamKey}&steamid=`;
    var memberArray = Object.keys(memberList);

    console.log(`6. Updating list of curated games owned by all guild members.`)

    var iterateThroughMemberOwnedGames = function (i) {
        var id = memberArray[i];

        returnRequest(`${url}${id}`, data => {
            console.log(`- updating ${id}s games (${parseInt(i)+1}/${memberArray.length})`)
            if (data == "error") {
                console.log(`Error while downloading data of ${id}s owned games!`);
                return "error";
            }
            data = JSON.parse(data);
            var memberOwned = data.response.games;
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
                return callback(memberList);
        });
    }
    iterateThroughMemberOwnedGames(0);
}
function updateMemberAchievements(memberList, callback) {
    var memberKeys = Object.keys(memberList);

    console.log(`7. Updating achievements of all guild members.`)

    var iterateThroughMemberList = function (memberIndex) {
        var gameKeys = Object.keys(memberList[memberKeys[memberIndex]].games);

        console.log(`- updating achievements of ${memberKeys[memberIndex]} (${parseInt(memberIndex) + 1}/${memberKeys.length})`);

        var iterateThroughGameList = function (gameIndex) {
            var url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${gameKeys[gameIndex]}&steamid=${memberKeys[memberIndex]}&key=${steamKey}&format=json`;
            returnRequest(url, data => {

                console.log(`-- game ${gameKeys[gameIndex]} (${parseInt(gameIndex) + 1}/${gameKeys.length})`);

                if (data == "error") {
                    console.log(`Error while downloading data of ${id}s owned games!`);
                    return "error";
                }
                data = JSON.parse(data);
                if (data.playerstats.success) {
                    var completed = 0;
                    var all = 0;
                    var completionRate = 0;
                    var lastUnlocked = 0;
                    var achievements = data.playerstats.achievements;

                    for (let i in achievements) {
                        if (lastUnlocked < achievements[i].unlocktime)
                            lastUnlocked = achievements[i].unlocktime;
                        if (achievements[i].achieved == 1){
                            completed++;
							if (group.lastUpdated - achievements[i].unlocktime <= 604800000) { // if achievement was unlocked within the last week
								group.log.push({
									"date": achievements[i].unlocktime*1000,
									"type": "achievement",
									"achievname": achievements[i].apiname,
									"player": data.playerstats.steamID,
									"game": data.playerstats.gameName
								});
							}
						}
                        all++;
                    }
                    completionRate = (completed / all) * 100;
                    if (completionRate == 100){
                        memberList[memberKeys[memberIndex]].ranking[group.gameList[gameKeys[gameIndex]].rating]++;
						if (group.lastUpdated - lastUnlocked <= 604800000) { // if game was 100%'d within the last week
							group.log.push({
									"date": lastUnlocked,
									"type": "complete",
									"player": data.playerstats.steamID,
									"game": data.playerstats.gameName
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
                        return callback(group);
                    }
                }
            });
        }
        iterateThroughGameList(0);
    }
    iterateThroughMemberList(0);
}

// FETCH FUNCTIONS
function responseSend(response, code, data, headers) {
	var head = {
		'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': 'http://arcyvilk.com'
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