import React from 'react'
import _ from 'lodash'
import MemberGame from '../MemberGame'

export default class MemberDetails extends React.Component {
    render() {
        const { member, show, games } = this.props
        const classDisplay = show ? "member-details flex-column display-flex" : "member-details flex-column display-none"
        
        const composeGameList = () => {
            let memberGames = _.orderBy(member.games, ['completionRate', 'lastUnlocked'], ['desc', 'desc'])
            return memberGames.map(game => {
                let gameDetails = games.find(g => g.id === game.appid)
                return <MemberGame game={{ ...game, title: gameDetails ? gameDetails.title : "unknown" }} /> 
            })
        }

        return(
            <div className={ classDisplay }>
                { composeGameList() }
            </div>
        )

    }
}