import React from 'react'
import _ from 'lodash'
import MemberGame from '../MemberGame'

export default class MemberDetails extends React.Component {
    render() {
        const { member, show, rating, games } = this.props
        const classDisplay = show ? "member-details flex-column display-flex" : "member-details flex-column display-none"
        
        const composeGameList = () => {
            let memberGames = _.orderBy(member.games, ['completionRate', 'lastUnlocked'], ['desc', 'desc'])
            return memberGames.map(game => {
                let gameDetails = games.find(g => Number(g.id) === Number(game.appid))
                if (!gameDetails) 
                    gameDetails = { title: "unknown", rating: "unknown", img: "unknown", playtime_forever: 0 }
                let ratingIcon = rating.find(r => r.score === gameDetails.rating);
                return <MemberGame game={{ 
                    ...game, 
                    title: gameDetails.title,
                    rating: ratingIcon ? ratingIcon.icon : 'fas fa-spinner',
                    img: gameDetails.img
                }} /> 
            })
        }

        return(
            <div className={ classDisplay }>
                { composeGameList() }
            </div>
        )

    }
}