'use strict';
var http = require('http');
var url = require('url');
var fs = require('fs');
var port = process.env.PORT || 1337;
//----------------------------------------------
var groupID = `103582791436640751`;
var steamKey = process.env.KEY;
var updating = false;
var server = http.createServer();

server.on('request', (request, response) => {
    var pathName = url.parse(request.url).pathname;

    if (pathName == "/gamesup" && !updating) {
        var gamesUrl = `http://store.steampowered.com/api/appdetails?appids=`;
        updating = true;

        fs.readFile("./data/data.json", "utf8", (err, group) => {
            if (err)
                return console.log("error");
            group = JSON.parse(group.trim());
            
            var gameKeys = Object.keys(group.gameList);
            var getGameList = function (id) {
                returnRequest(`${gamesUrl}${gameKeys[id]}`, d => {
                    if (d == "error") {
                        console.log("Error while downloading game data!");
                        return "error";
                    }
                    d = JSON.parse(d);
                    group.gameList[gameKeys[id]].title = d[gameKeys[id]].data.name;
                    group.gameList[gameKeys[id]].img = d[gameKeys[id]].data.header_image;
                    if (id < gameKeys.length - 1)
                        getGameList(id + 1);
                    else {
                        responseSend(response, 200, JSON.stringify(group));
                        updating = false;
                        fs.writeFile(`data/data.json`, JSON.stringify(group), error => {
                            if (error)
                                console.log(error);
                            console.log("Game list updated!");
                            return;
                        });
                    };
                });
            }
            getGameList(0);
        })
    }
    else if (pathName == "/update" && !updating) {
        var groupUrl = `http://steamcommunity.com/gid/${groupID}/memberslistxml/?xml=1`;
        var memberUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=`;
        var curatedUrl = `http://store.steampowered.com/curator/7119343-0.1%25/ajaxgetfilteredrecommendations/render/?query=&start=0&count=1000&tagids=&sort=recent&types=0`;
        var gamesUrl = `http://store.steampowered.com/api/appdetails?appids=`;
        var group = {
            groupDesc: '',
            groupHead: '',
            memberList: {},
            gameList: {}
        };

        updating = true;
        returnRequest(groupUrl, data => {
            if (data == "error") {
                console.log("Error while downloading group data!");
                return "error";
            }
            var json = JSON.parse(data);
            var memberIDList = "";

            group.groupDesc = json.elements[0].elements[1].elements[3].elements[0].cdata;
            group.groupHead = json.elements[0].elements[1].elements[2].elements[0].cdata;
            for (let i in json.elements[0].elements) {
                if (json.elements[0].elements[i].name == "members") {
                    for (let j in json.elements[0].elements[i].elements) {
                        group.memberList[json.elements[0].elements[i].elements[j].elements[0].text] = {
                            "name": "",
                            "avatar": "",
                            "games": {},
                            "ranking": {
                                "1": 0,
                                "2": 0,
                                "3": 0,
                            }
                        };
                        memberIDList += `${json.elements[0].elements[i].elements[j].elements[0].text},`;
                    }
                }
            }
            returnRequest(`${memberUrl}${memberIDList}`, memberData => {
                if (memberData == "error") {
                    console.log("Error while downloading members data!");
                    return "error";
                }
                memberData = JSON.parse(memberData);

                for (let i in memberData.response.players) {
                    group.memberList[memberData.response.players[i].steamid].name = memberData.response.players[i].personaname;
                    group.memberList[memberData.response.players[i].steamid].avatar = memberData.response.players[i].avatarmedium;
                } 
                returnRequest(curatedUrl, gamesData => {
                    if (gamesData == "error") {
                        console.log("Error while downloading curated games data!");
                        return "error";
                    }
                    gamesData = JSON.parse(gamesData);
                    group.gameList = getGameDataJson(gamesData);
                    group.lastUpdated = Date.now();

                    var gameKeys = Object.keys(group.gameList);
                    var memberKeys = Object.keys(group.memberList);

                    var iterateThroughGames = function (game) {
                        returnRequest(gamesUrl, gameData => {
                            if (gameData == "error") {
                                console.log("Error while downloading game data!");
                                return "error";
                            }
                            group.gameList[gameKeys[game]].title = gameData.data.name;    
                            group.gameList[gameKeys[game]].img = gameData.data.header_image;

                            if (game < gameKeys.length - 1)
                                iterateThroughGames(game + 1);
                            else {
                                var iterateThroughMembers = function (member) {
                                    var iterateThroughAchievements = function (game) {
                                        var achievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${gameKeys[game]}&key=${steamKey}&steamid=${memberKeys[member]}&format=json`;

                                        returnRequest(achievementsUrl, achData => {
                                            if (achData == "error") {
                                                console.log("Error while downloading achievement data!");
                                                return "error";
                                            }
                                            achData = JSON.parse(achData);

                                            if (achData.playerstats.success) {
                                                var completed = 0;
                                                var all = 0;

                                                for (let i in achData.playerstats.achievements) {
                                                    if (achData.playerstats.achievements[i].achieved == 1)
                                                        completed++;
                                                    all++;
                                                }
                                                group.memberList[memberKeys[member]].games[gameKeys[game]] = { "completionRate": (completed / all) * 100 };
                                            }
                                            console.log(`member ${member}, game ${game}`);
                                            if (game < gameKeys.length - 1)
                                                iterateThroughAchievements(game + 1);
                                            else {
                                                if (member < memberKeys.length - 1)
                                                    iterateThroughMembers(member + 1);
                                                else {
                                                    for (let memberID in group.memberList) {
                                                        for (let gameID in group.memberList[memberID].games) {
                                                            if (group.memberList[memberID].games[gameID].completionRate == 100)
                                                                group.memberList[memberID].ranking[group.gameList[gameID].rating]++;
                                                        }
                                                    }
                                                    responseSend(response, 200, JSON.stringify(group));
                                                    updating = false;
                                                    fs.writeFile(`data/data.json`, JSON.stringify(group), error => {
                                                        if (error)
                                                            console.log(error);
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    iterateThroughAchievements(0);
                                }
                                iterateThroughMembers(0);
                            }
                        });
                    }
                    iterateThroughGames(0);
                }); 
            });
        })
    }
    else {
        fs.readFile(__dirname + pathName, (err, data) => {
            if (err)
                responseSend(response, 404, `<h1>404</h1><p>Nie znaleziono strony!</p><p>${JSON.stringify(err)}</p>`);
            else
                responseSend(response, 200, data);
        });
    }
});
server.listen(port, "0.0.0.0");
console.log(`Server listens on port ${port}.`);

function getGameDataJson(data) {
    var helper;
    var games = {};

    data.results_html = data.results_html.replace(/\r|\n|\t|&quot;/g, "");
    data.results_html = data.results_html.replace(/\'/g, '"');
    helper = data.results_html.split(`<div class="recommendation" >`);

    for (let i in helper) {
        if (helper[i].indexOf(`data-ds-appid`) != -1) {
            var gid = helper[i].substring(helper[i].indexOf(`data-ds-appid="`) + `data-ds-appid="`.length, helper[i].indexOf(`" onmouseover`)).trim();
            var gdesc = helper[i].substring(helper[i].indexOf(`<div class="recommendation_desc">"`) + `<div class="recommendation_desc">"`.length, helper[i].indexOf(`"</div>`)).trim();
            var grat = 1;
            if (gdesc.startsWith("🌟"))
                grat = 3;
            if (gdesc.startsWith("☆"))
                grat = 2;
            games[gid] = { "desc": gdesc, "rating": grat };
        }
    }
    return games;
}

function responseSend(response,code,data) {
    response.writeHead(code);
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
// FETCH FUNCTIONS
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