const axios = require('axios')
const cache = require('../cache/cache')
const KEY = require('../../config.json').KEY
const api = require('../data/api.json')

const extractMemberIDs = raw => {
    const rawMembers = raw
        .toString()
        .substring(
            raw.indexOf("<steamID64>"), 
            raw.indexOf("</members>")
        )
    const memberIDs = rawMembers.split("</steamID64>");
    return memberIDs.map(id => id = {
        name: "",
        avatar: "",
        games: [ ],
        ranking: { },
        id: id
            .replace('</steamID64>', '')
            .replace('<steamID64>', '')
            .replace('\r\n', '')
        }).filter(m => m.id.length > 0)
}

const getGroupData = () => new Promise((resolve, reject) => {
    console.log(`3. Updating list of guild members.`)

    const url = api.groupdata;
    axios.get(url)
        .then(response => resolve(extractMemberIDs(response.data)))
        .catch(err => reject(err))
})

const getMembersData = members => new Promise((resolve, reject) => {
    console.log(`4. Updating basic details of guild members.`)

    let url = api.playersummaries.replace('STEAM_KEY', KEY);
    members.map(m => url += `${m.id},`);

    axios.get(url)
        .then(response => handleMembersData(response.data))
        .catch(err => reject(err))

    const handleMembersData = data => {
        data.response.players.map(player => {
            const memberIndex = members.findIndex(member => member.id === player.steamid);
            if (memberIndex !== null && memberIndex !== undefined) {
                members[memberIndex].name = player.personaname;
                members[memberIndex].avatar = player.avatarmedium;
                addMemberToLogIfNew(player.steamid);
            }
        })

        return resolve(members);
    }
})

const addMemberToLogIfNew = memberId => {
    if (cache.members.filter(member => member.id === memberId).length == 0){
		cache.log.push({
			"date":Date.now(),
			"type": "newMember",
			"player": memberId
		});
		console.log(`-- new member detected - adding ${memberId} to log file`);
    }
}

const getMembersOwnedGames = members => new Promise((resolve, reject) => {
    console.log('5. Updating list of curated games owned by guild members.')

    let url = api.memberownedgames.replace('STEAM_KEY', KEY);

    const iterateThroughMembers = index => {
        console.log(`-- games of member ${parseInt(index)+1}/${members.length}`)
        axios.get(url+members[index].id)
            .then(response => {
                if (response.status !== 200)
                    return reject(':c')
                if (response.data.response && response.data.response.games) //member not set to private
                    members[index].games = response.data.response.games.filter(
                        game => !!cache.games.find(cachedgame => cachedgame.id == game.appid)
                    );
                index < members.length - 1
                    ? setTimeout(() => iterateThroughMembers(index+1), 50)
                    : resolve(members);
            })
            .catch(err => reject(err));
    }
    iterateThroughMembers(0);
})


const update = () => 
    getGroupData()
        .then(getMembersData)
        .then(getMembersOwnedGames)

module.exports = update