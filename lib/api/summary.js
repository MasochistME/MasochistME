const cache = require('../cache/cache')
const rating = require('../data/rating.json')

const summarizePointsForMembers = () => new Promise((resolve, reject) => {
    console.log('7. Summarizing points for all members.')

    try {
        let members = cache.members.map((member, index) => {
            console.log(`-- member ${parseInt(index)+1}/${cache.members.length}`)

            let ranking = { }
            for (let r of rating)
                ranking[r.score] = 0
            member.games
                .filter(game => game.completionRate == 100)
                .map(filteredgame => {
                    let game = cache.games.find(cachedgame => cachedgame.id == filteredgame.appid)
                    game 
                        ? ranking[game.rating]
                            ? ranking[game.rating] += 1
                            : ranking[game.rating] = 1
                        : null
                })
            member.ranking = ranking;
            return member
        })
        resolve(members)
    }
    catch(err) {
        reject(err)
    }
})

module.exports = summarizePointsForMembers