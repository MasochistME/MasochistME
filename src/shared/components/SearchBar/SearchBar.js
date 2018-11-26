import React from 'react'
import { connect } from 'react-redux'
import { searchGames, searchMembers } from '../../store/modules/Search';

class SearchBar extends React.Component {
    constructor() {
        super()
        this.state = {
            searchFor: null
        }
        this.adjustToTab = this.adjustToTab.bind(this);
    }

    componentDidMount = () => this.adjustToTab()

    adjustToTab = () => {
        switch(this.props.activeTab) {
            case 'games': return this.setState({ searchFor: 'games' })
            case 'ranking': return this.setState({ searchFor: 'members' })
            default: return
        }
    }
    update = event => {
        const searchString = event.target.value
        switch(this.state.searchFor) {
            case 'games': return this.props.dispatch(searchGames(searchString))
            case 'members': return this.props.dispatch(searchMembers(searchString))
            default: return
        }
    }

    render() {
        return(
            <div className='wrapper-searchbar'>
                <label htmlFor='searchbar' className='searchbar-label'>Find { this.state.searchFor }</label>
                <input 
                    className='searchbar' 
                    type='text' 
                    placeholder={ `${this.state.searchFor} here` }
                    onChange={ this.update }
                />
            </div>)
    }
}

const mapStateToProps = state => ({ 
    activeTab: state.activeTab 
})
const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( SearchBar ) 