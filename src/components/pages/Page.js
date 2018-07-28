import React from 'react'
import { connect } from 'react-redux'
import PageHome from './Home'
import PageGames from './Games'
import PageMembers from './Members'
import PageEvents from './Events'

const assignPageType = tab => {
    switch (tab) {
        case 'home': return <PageHome />
        case 'games': return <PageGames />
        case 'members': return <PageMembers />
        case 'events': return <PageEvents />
        default: return <PageHome />
    }
}

class Page extends React.Component{
    render() {
        const { props } = this;
        console.log(props.state.link) //UNDEFINED
        return (
            <div className={ `wrapper-page` }>
                { assignPageType(props.state.link) }
            </div>
        )
    }
}

const mapStateToProps = state => ( { state })

export default connect(
    mapStateToProps
)( Page )