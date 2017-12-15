var lastUpdated = 0;
var urls = {
    server: "http://195.181.241.222",
    //server:"http://127.0.0.1:1337",
    steamData: "/data/data.json",
    update: "/update",
};

window.onload = function () {
    loadPageContents();
};
function loadPageContents() {
    var path = `${urls.server}${urls.steamData}`;

    getUrlContent(path, data => {
        data = JSON.parse(data);
        lastUpdated = data.lastUpdated;

        document.getElementById("header").innerHTML = data.groupHead;
        document.getElementById("content").innerHTML = `<ul>${createMemberList(data)}</ul>`;
    });
};
function updateData() {
    var time = (parseInt(Date.now()) - parseInt(lastUpdated)) / 1000;
    var steamData = "/update";

    if (document.getElementById("update-button").innerHTML == "Updating...") {
        alert(`Easy man, it's still updating!`);
        return;
    }
    if (time < 3600) {
        alert(`Hold on! It was updated ${time} seconds ago. Wait ${3600 - time} seconds to update again.`);
        return;
    }
    document.getElementById("update-button").innerHTML = "Updating...";
    getUrlContent(urls.update, data => {
        document.getElementById("update-button").innerHTML = "Updated!";
    });
}

// Create member rankings
function createMemberList(data) {
    var list = '';
    var sorted = [];

    for (let id in data.memberList)
        sorted.push({ "id": id, "avatar": data.memberList[id].avatar, "name": data.memberList[id].name, "games": data.memberList[id].games, "ranking": data.memberList[id].ranking });
    sorted.sort((b, a) => {
        return (a.ranking["1"] + a.ranking["2"] + a.ranking["3"]) - (b.ranking["1"] + b.ranking["2"] + b.ranking["3"]);
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
            var r = data.gameList[sortedglist[j].id].rating;
            switch (r) {
                case 1: {
                    r = "✓";
                    break;
                }
                case 2: {
                    r = "☆";
                    break;
                }
                case 3: {
                    r = "★";
                    break;
                }
                default: break;
            }
            glist += `<li class="game"><img alt="game header" src="${data.gameList[sortedglist[j].id].img}" class="game-image"/><div class="game-info">` +
                `<div class="game-title">${r} ${data.gameList[sortedglist[j].id].title}</div>` +
                `<div class="game-completion" style="background-image:url('img/progress.png'); background-position-y: ${20 * parseInt(sortedglist[j].completionRate) + 20}px;">${parseInt(sortedglist[j].completionRate)}%</div></div></li>`;
        }
        list += `<li class="member" id="id-member-${sorted[i].id}" onclick="showDetails(this.id);"><div class="member-order"><p class="strong">${parseInt(i) + 1}</p></div>` +
            `<img class="member-avatar" src="${sorted[i].avatar}" alt="avatar"/><div class="member-info">` +
            `<div class="member-name">${sorted[i].name}</div>` +
            `<div class="member-rating"><div class="rating rating-total">Total: ${sorted[i].ranking["1"] + sorted[i].ranking["2"] + sorted[i].ranking["3"]}</div>` +
            `<div class="rating rating-fullstar">★ ${sorted[i].ranking["3"]}</div>` +
            `<div class="rating rating-halfstar">☆ ${sorted[i].ranking["2"]}</div>` +
            `<div class="rating rating-other">✓ ${sorted[i].ranking["1"]}</div></div></div></li>` +
            `<li class="member-details" id="id-member-details-${sorted[i].id}"><ul class="member-progress">` +
            `${glist}`+
            `</ul></li>`;
    }
    return list;
};
function graphicRepresentationGameCompletion(percentage) {
    var canvas = document.getElementById("content-canvas");
    var context = canvas.getContext("2d");
}
function showDetails(id) {
    id = id.replace("id-member-", "");
    var el = document.getElementById(`id-member-details-${id}`).style.display;
    
    if (el != "block")
        document.getElementById(`id-member-details-${id}`).style.display = "block";
    else
        document.getElementById(`id-member-details-${id}`).style.display = "none";
}
// AJAX stuffs
function getUrlContent(url, callback) {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(ajax.responseText);
        }
    };
    ajax.open("GET", url, true);
    ajax.send();
};