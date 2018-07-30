import React from 'react'
import { connect } from 'react-redux'
import { swapRatingToIcon } from '../helpers/helper'
import { showGamesRated } from '../redux/modules/CheckBoxes'

class CheckBoxGameChoice extends React.Component{
    changeRatingVisibility = event => {
        let visibleGamesRatedArray = [ ];
        event.target.checked
            ? visibleGamesRatedArray = [ event.target.value ].concat(this.props.state.showGamesRated)
            : visibleGamesRatedArray = this.props.state.showGamesRated.filter(rating => rating !== event.target.value)
        this.props.dispatch(showGamesRated(visibleGamesRatedArray))
    }

    render() {
        const score = this.props.score
        const icon = swapRatingToIcon(score)
        return (
            <div>
                <input 
                    name="game" 
                    value={ score } 
                    id={ `game-choice-${ score }` } 
                    className="game-choice-checkbox" 
                    type="checkbox" 
                    defaultChecked 
                    onChange={ this.changeRatingVisibility }
                />
                <label for={ `game-choice-${ score }` }>show { icon } games</label>
            </div>
        )
    }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(
    mapStateToProps,
    mapDispatchToProps
)( CheckBoxGameChoice )