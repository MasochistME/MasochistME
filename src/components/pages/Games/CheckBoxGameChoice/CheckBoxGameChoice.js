import React from 'react'
import { connect } from 'react-redux'
import { showGamesRated } from '../../../../shared/store/modules/CheckBoxes'

class CheckBoxGameChoice extends React.Component{
    changeRatingVisibility = event => {
        let visibleGamesRatedArray = [ ];
        event.target.checked
            ? visibleGamesRatedArray = [ event.target.value ].concat(this.props.showGamesRated)
            : visibleGamesRatedArray = this.props.showGamesRated.filter(rating => rating !== event.target.value)
        this.props.dispatch(showGamesRated(visibleGamesRatedArray))
    }

    render() {
        const score = this.props.score
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
                <label for={ `game-choice-${ score }` }>show <i className={ this.props.icon }></i> games</label>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    showGamesRated: state.showGamesRated 
})
const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( CheckBoxGameChoice )