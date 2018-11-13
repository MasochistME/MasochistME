import React from 'react'
import MemberGameProgressBar from '../MemberGameProgressBar'

export default class MemberGame extends React.Component {
    render() {
        const game = this.props.game

        return (
            <div className="m-game flex-row">
                <img className="m-game-logo" src={ game.img } alt="logo"></img>
                <div className="m-game-info" >
                    <div className="flex-row">
                        <i className={ game.rating } />
                        <div className="m-game-title"> { game.title }</div>
                    </div>
                    <div className="m-game-times flex-column">
                        {
                            game.completionRate === 100
                                ? <div className="m-game-completion-timer">{ new Date(game.lastUnlocked*1000).toLocaleString() }</div>
                                : null
                        }
                        <div style={{ display: "none" }}>{ Math.round(parseInt(game.playtime_forever,10)/60) } h</div>
                    </div>
                </div>
                <MemberGameProgressBar percentage={ Math.floor(game.completionRate) }/>
            </div>
        )
    }
}