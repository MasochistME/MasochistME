import React from 'react'
import { swapRatingToIcon } from '../helpers/helper'

export default class CheckBoxGameChoice extends React.Component{
    render() {
        const score = this.props.score
        const icon = swapRatingToIcon(score)
        return (
            <div>
                <input name="game" value={ score } id={ `game-choice-${ score }` } className="game-choice-checkbox" type="checkbox" checked />
                <label for={ `game-choice-${ score }` }>show { icon } games</label>
            </div>
        )
    }
}