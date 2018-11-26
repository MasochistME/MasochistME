import React from 'react'
import { connect } from 'react-redux'
import Event from './Event'

class PageEvents extends React.Component {
    render() {
        const { props } = this

        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <p>This is the list showcasing last 100 events.</p>
                        <p>There are three different types of events:</p>
                        <ul>
                            <li>new game being curated,</li>
                            <li>new member joining the community,</li>
                            <li>member of the community finishing 100% of the game.</li>
                        </ul>
                        <p>In the future, there will be additional events tied to badges.</p>
                    </div>
                </div>
                <div className="wrapper-events">
                    <ul className="events-list"> 
                    { props.events.slice(0, 100)
                        .map((event, eventIndex) => <Event event={ event } key={ `event-${eventIndex}` }/>)
                    }
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    events: state.events 
})

export default connect(
  mapStateToProps
)( PageEvents )