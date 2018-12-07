const axios = require('axios')
const KEY = require('../../config.json').KEY
const api = require('../data/api.json')
const cache = require('../cache/cache')

const updateMemberAchievements = () => new Promise((resolve, reject) => {
    console.log('6. Updating members\' achievements.') 
    
    // [TBD] make it so it doesnt operate on cache! Cache should be untouched until after update, otherwise it'll be impossible
    // to do event logging - it needs to be compared to something!!!

    let url = api.achievements.replace('STEAM_KEY', KEY)
    const iterateThroughMembers = memberIndex => {
        console.log(`-- member ${parseInt(memberIndex)+1}/${cache.members.length}`)

        cache.members[memberIndex].games.length == 0 //user has profile set up as private and therefore has no games listed
            ? setTimeout(() => iterateThroughMembers(memberIndex+1), 50)
            : iterateThroughGames(0, memberIndex)
    }

    const iterateThroughGames = (gameIndex, memberIndex) => {
        console.log(`--- game ${parseInt(gameIndex)+1}/${cache.members[memberIndex].games.length}`)
        let customUrl = url.replace('GAME_ID', cache.members[memberIndex].games[gameIndex].appid)
                .replace('MEMBER_ID', cache.members[memberIndex].id)
        axios.get(customUrl)
            .then(response => {
                let numberOfAllAchievements = response.data.playerstats.achievements.length
                let numberOfUnlockedAchievements = response.data.playerstats.achievements.filter(achievement => achievement.achieved == 1).length
                let lastUnlockedAchievement = 0;
                response.data.playerstats.achievements.map(achievement => 
                    achievement.unlocktime > lastUnlockedAchievement
                        ? lastUnlockedAchievement = achievement.unlocktime
                        : null
                )
                let completionRate = 100*numberOfUnlockedAchievements/numberOfAllAchievements
                cache.members[memberIndex].games[gameIndex].completionRate = completionRate
                cache.members[memberIndex].games[gameIndex].lastUnlocked = lastUnlockedAchievement

                if (completionRate === 100 
                    && Date.now() - (lastUnlockedAchievement*1000) <= 604800000
                    && !cache.log.includes(log => 
                        log.type == "complete"
                        && Number(log.player) === Number(cache.members[memberIndex].id) 
                        && Number(log.game) === Number(cache.members[memberIndex].games[gameIndex].appid))
                    // ^ checks if the log isn't alredy there
                ) {
                    cache.log.push({
                        "date": lastUnlockedAchievement * 1000,
                        "type": "complete",
                        "player": cache.members[memberIndex].id,
                        "game": cache.members[memberIndex].games[gameIndex].appid
                    });
                    console.log(`-- new 100% detected - adding to log file`);
                }

                gameIndex < cache.members[memberIndex].games.length - 1
                    ? iterateThroughGames(gameIndex+1, memberIndex)
                    : memberIndex < cache.members.length - 1
                        ? setTimeout(() => iterateThroughMembers(memberIndex+1), 50)
                        : resolve(cache.members)
            })
            .catch(err => reject(err))
    }

    iterateThroughMembers(0)
})

module.exports = updateMemberAchievements