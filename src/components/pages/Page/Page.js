import React from 'react'
import { connect } from 'react-redux'
import PageHome from '../Home'
import PageGames from '../Games'
import PageRanking from '../Ranking'
import PageEvents from '../Events'
import PageSupport from '../Support'
import PageProfile from '../Profile'

const assignPageType = tab => {
    switch (tab) {
        case 'home': return <PageHome />
        case 'games': return <PageGames />
        case 'ranking': return <PageRanking />
        case 'events': return <PageEvents />
        case 'support': return <PageSupport />
        case 'profile': return <PageProfile />
        default: return <PageHome />
    }
}

class Page extends React.Component{
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { props } = this;
        return (
            <div className='wrapper-page'>
                { assignPageType(props.state.activeTab) }
            </div>
        )
    }
}

const mapStateToProps = state => ( { state })

export default connect(
    mapStateToProps
)( Page )