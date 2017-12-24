var lastUpdated = 0;
var urls = {
    server: "http://195.181.241.222:1337",
    //server:"http://127.0.0.1:1337",
    steamData: "/data/data.json",
    update: "/update"
};
var data = {};

// REDONE INTO JQUERY
$(document).ready(function () {
    var page = document.getElementsByTagName("body")[0].id;
    loadPageContents(page);

    $('#searchbar').on('input', function (e) {
        displayElementsFittingSearchOptions();
    });
    $('.game-choice-checkbox').on('click', function () {
        displayElementsFittingSearchOptions();
    })
});
function loadPageContents(page) {
    getUrlContent(`${urls.server}${urls.steamData}`, response => {
        if (response == `500`)
            return alert(`Internal server error. Please try again later`);

        data = JSON.parse(response);
        lastUpdated = data.lastUpdated;
        if (page == "page-players")
            $('#content').html(`<ul>${createMembersList(data)}</ul>`);
        if (page == "page-games")
            $('#content').html(`<div id="game-list">${createGamesList(data)}</div>`);
    });
};
function updateData() {
    var time = (parseInt(Date.now()) - parseInt(lastUpdated)) / 1000;

    if (time < 3600)
        return alert(`Hold on! It was updated ${parseInt(time / 60)} minutes ago. Wait ${parseInt((3600 - time) / 60)} minutes to update again.`);
    if ($('#update-button').html() == "Updating...")
        return alert(`Easy man, it's still updating!`);
    $('#update-button').html("Updating...");
    getUrlContent(`${urls.server}${urls.update}`, data => {
        alert(data);
        $('#update-button').html("Updated!");
    });
}

// CREATING RANKINGS
function createMembersList(data) {
    var list = '';
    var sorted = [];

    for (let id in data.memberList)
        sorted.push({ "id": id, "avatar": data.memberList[id].avatar, "name": data.memberList[id].name, "games": data.memberList[id].games, "ranking": data.memberList[id].ranking });
    sorted.sort((b, a) => {
        return (a.ranking["1"] + a.ranking["2"] * 2 + a.ranking["3"] * 3) - (b.ranking["1"] + b.ranking["2"] * 2 + b.ranking["3"] * 3);
    });

    for (let i in sorted) {
        var glist = "";
        var sortedglist = [];

        for (let id in sorted[i].games)
            sortedglist.push({ "id": id, "completionRate": sorted[i].games[id].completionRate });
        sortedglist.sort((b, a) => {
            return (a.completionRate - b.completionRate);
        });

        for (let j in sortedglist) {
            var r = rateGame(data.gameList[sortedglist[j].id].rating);
            glist += `<li class="m-game"><img alt="game header" src="${data.gameList[sortedglist[j].id].img}" class="m-game-image"/>` +
                `<div class="m-game-info">` +
                `<div class="m-game-title">${r} ${data.gameList[sortedglist[j].id].title}</div>` +
                `<div class="m-game-times">`;
            if (sortedglist[j].completionRate == 100) {
                var time = new Date(data.memberList[sorted[i].id].games[sortedglist[j].id].lastUnlocked * 1000);
                var d = {
                    'year': time.getFullYear(),
                    'month': time.getMonth() + 1,
                    'date': time.getDate(),
                    'hour': time.getHours(),
                    'min': time.getMinutes()
                }
                for (let i in d) {
                    if (d[i] < 10)
                        d[i] = `0${d[i]}`;
                }
                glist += `<div class="m-game-completion-timer">${d.year}.${d.month}.${d.date}, ${d.hour}:${d.min}</div>`;
            }
            glist += `<div class="m-game-playtime">${parseInt((data.memberList[sorted[i].id].games[sortedglist[j].id].playtime) / 60)} h</div></div></div>` +
                `<div class="m-game-completion" style="background-position-y: ${20 * parseInt(sortedglist[j].completionRate) + 20}px;">${parseInt(sortedglist[j].completionRate)}%</div></li>`;
        }
        list += `<li class="member" id="id-member-${sorted[i].id}" onclick="showDetails(this.id, 'member');"><div class="member-order"><p class="strong">${parseInt(i) + 1}</p></div>` +
            `<img class="member-avatar" src="${sorted[i].avatar}" alt="avatar"/><div class="member-info">` +
            `<div class="member-name">${sorted[i].name}</div>` +
            `<div class="member-rating"><div class="rating rating-total">Points: ${sorted[i].ranking["1"] + sorted[i].ranking["2"] * 2 + sorted[i].ranking["3"] * 3}</div>` +
            `<div class="rating rating-fullstar">★ ${sorted[i].ranking["3"]}</div>` +
            `<div class="rating rating-halfstar">☆ ${sorted[i].ranking["2"]}</div>` +
            `<div class="rating rating-other">✓ ${sorted[i].ranking["1"]}</div></div></div></li>` +
            `<li class="member-details" id="id-member-details-${sorted[i].id}"><ul class="member-progress">` +
            `${glist}` +
            `</ul></li>`;
    }
    return list;
}
function createGamesList(data) {
    var list = '';
    var sorted = sortGamesByRating();

    for (let i in sorted) {
        var r = rateGame(data.gameList[sorted[i].id].rating);
        var mlist = '';

        list += `<div class="game rated-${data.gameList[sorted[i].id].rating}" id="id-game-${sorted[i].id}" onclick="createLeaderboard(${sorted[i].id});" style="background-image:url('${data.gameList[sorted[i].id].img}')">` +
            `<div class="game-info"><div class="game-rating">${rateGame(data.gameList[sorted[i].id].rating)}</div>` +
            `<div class="game-title">${data.gameList[sorted[i].id].title.toUpperCase()}</div>` +
            `<div class="game-desc">${data.gameList[sorted[i].id].desc}</div></div></div>`;
    }
    return list;
};
function sortGamesByRating() {
    var sorted = [];

    for (let gameId in data.gameList)
        sorted.push({ "id": gameId, "d": data.gameList[gameId] });
    sorted.sort((a, b) => {
        return (b.d.rating - a.d.rating);
    });
    return sorted;
};
function createLeaderboard(gameId) {
    var list = '';
    var sortedMembers = [];
    var records = getGameRecords(gameId);

    for (let member in data.memberList) {
        for (let game in data.memberList[member].games) {
            if (game == gameId) {
                sortedMembers.push({ "id": member, "d": data.memberList[member].games[gameId] });
                continue;
            }
        }
    }
    sortedMembers.sort((a, b) => { return a.d.lastUnlocked - b.d.lastUnlocked });
    sortedMembers.sort((a, b) => { return (b.d.completionRate - a.d.completionRate) });
    
    for (let i in sortedMembers){
        var member = sortedMembers[i].id;
        if (data.memberList.hasOwnProperty(member)) {
            list += `<li class='g-member'><img alt='member-avatar' class='g-member-image' src='${data.memberList[member].avatar}' />` +
                `<div class='g-member-info'><div class='g-member-name'>${whichPlace(i)}` +
                `${data.memberList[member].name}${(function () { if (data.memberList[member].name == records.fastest.player) return " 🏆"; return ""; })()}</div >` +
                `<div class='g-member-times'>`;
            if (data.memberList[member].games[gameId].completionRate == 100) {
                var time = new Date(data.memberList[member].games[gameId].lastUnlocked * 1000);
                var d = {
                    'year': time.getFullYear(),
                    'month': time.getMonth() + 1,
                    'date': time.getDate(),
                    'hour': time.getHours(),
                    'min': time.getMinutes()
                }
                for (let i in d) {
                    if (d[i] < 10)
                        d[i] = `0${d[i]}`;
                }
                list += `<div class="g-member-completion-timer">${d.year}.${d.month}.${d.date}, ${d.hour}:${d.min}</div>`;
            }
            list += `<div class="g-member-playtime">${parseInt((data.memberList[member].games[gameId].playtime) / 60)} h</div></div></div>` +
                `<div class='g-member-completion' style="background-image:url('img/progress.png'); ` +
                `background-position-y: ${20 * parseInt(data.memberList[member].games[gameId].completionRate) + 20}px;">` +
                `${parseInt(data.memberList[member].games[gameId].completionRate)}%</div></li >`;
        }
    }
    $(`#leaderboards`).html(`<h1>Leaderboards: ${data.gameList[gameId].title}</h1>` +
        `<div id="game-statistics">` +
        `<ul>` +
        `<li>Fastest time: ${records.fastest.time} hours (${records.fastest.player})</li>` +
        `<li>Average completion time: ${records.average} hours</li>` +
        `<li>Number of completions: ${records.numberOfCompletions}</li>` +
        `</ul>`+
        `</div>` +
        `<ul class="game-leaderboards">${list}</ul></div>`);
    showLeaderboards('show');
}
function getGameRecords(gameId) {
    var records = {
        "fastest": {
            "time": null,
            "player": null
        },
        "numberOfCompletions": 0,
        "average": 0
    };
    for (let i in data.memberList) {
        if (data.memberList[i].games.hasOwnProperty(gameId) && data.memberList[i].games[gameId].completionRate == 100) {
            var game = data.memberList[i].games[gameId];
            if (records.fastest.time > game.playtime || !records.fastest.time) {
                records.fastest.time = game.playtime;
                records.fastest.player = data.memberList[i].name;
            }
            records.numberOfCompletions++;
            records.average += game.playtime;
        }
    }
    records.average = parseInt(records.average / records.numberOfCompletions / 60);
    records.fastest.time = parseInt(records.fastest.time / 60);
    return records;
}

// DISPLAYING FUNCTIONS
function displayElementsFittingSearchOptions() {
    var searchedString = $('#searchbar').val().toLowerCase().trim();

    if ($('body').attr('id') == 'page-players') {
        $('.member').each(function () {
            if (searchedString == '' || $(this).children('.member-info').children('.member-name').html().toLowerCase().indexOf(searchedString) != -1)
                $(this).css('display', 'flex');
            else $(this).css('display', 'none');
        });
    }
    if ($('body').attr('id') == 'page-games') {
        $('.game').each(function () {
            $(this).css('display', 'none');
            if (searchedString == '' || $(this).children('.game-info').children('.game-title').html().toLowerCase().indexOf(searchedString) != -1) {   
                for (let score = 1; score <= 3; score++) {
                    if ($(this).is(`.rated-${score}`) && $(`#game-choice-${score}`).is(':checked')) {
                        $(this).css('display', 'flex');
                        continue;
                    }
                }
            }
        });
    }
}
function showLeaderboards(action) {
    if (action == 'hide')
        $("#wrapper-leaderboards").css("display", "none");
    if (action == 'show')
        $("#wrapper-leaderboards").css("display", "flex");
};
function showDetails(id, type) {
    id = id.replace(`id-${type}-`, "");
    var el = document.getElementById(`id-${type}-details-${id}`).style.display; //????

    if (el != "block")
        $(`#id-${type}-details-${id}`).css("display","block");
    else
        $(`#id-${type}-details-${id}`).css("display", "none");
};
//PARSING
function whichPlace(place) {
    switch (place) {
        case "0":
            return "🥇 ";
        case "1":
            return "🥈 ";
        case "2":
            return "🥉 ";
        default: return "";
    }
}
function rateGame(r) {
    switch (r) {
        case 1:
            return "✓";
        case 2:
            return "☆";
        case 3:
            return "★";
        default: return "✓";
    }
};

// AJAX STUFFS
function getUrlContent(url, callback) {
    var ajax = new XMLHttpRequest();
    
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            callback(ajax.responseText);
        if (this.status == 500)
            callback(`500`);
    };
    ajax.open("GET", url, true);
    ajax.send();
};