import React from 'react'

export default class MemberGame extends React.Component {
    render() {
        const game = this.props.game

        return (
            <div className="m-game flex-row">
                <img className="m-game-logo" src={ game.image } alt="logo"></img>
                <div className="m-game-info" >
                    <div className="m-game-title">
                        <div>{ game.rating }</div>
                        <div>{ game.title }</div>
                    </div>
                    <div className="m-game-times flex-column">
                        {
                            game.completionRate === 100
                                ? <div className="m-game-completion-timer">{ new Date(game.lastUnlocked*1000).toLocaleString() }</div>
                                : null
                        }
                        <div>{ Math.round(parseInt(game.playtime_forever,10)/60) } h</div>
                    </div>
                </div>
                <div className="m-game-completion">{ Math.floor(game.completionRate) }%</div>
            </div>
        )
    }
}