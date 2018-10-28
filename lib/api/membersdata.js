const axios = require('axios')
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
            }
        })

        return resolve(members);
    }
})



const update = () => 
    getGroupData()
        .then(getMembersData)

module.exports = update