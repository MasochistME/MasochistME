import React from 'react'
import { connect } from 'react-redux'
import { searchGames, searchMembers } from '../redux/modules/Search';

class SearchBar extends React.Component {
    update = event => {
        const searchString = event.target.value
        if (this.props.state.activeTab === 'games')
            this.props.dispatch(searchGames(searchString))
        if (this.props.state.activeTab === 'memberss')
            this.props.dispatch(searchMembers(searchString))
    }

    render() {
        return(
            <div className='wrapper-searchbar'>
                <label for='searchbar' className='searchbar-label'>Search game</label>
                <input 
                    className='searchbar' 
                    type='text' 
                    placeholder='game title here'
                    onChange={ this.update }
                />
            </div>)
    }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( SearchBar ) 