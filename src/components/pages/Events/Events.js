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
                        <p>This is the list showcasing the last 100 events.</p>
                        <p>There are six different types of events:</p>
                        <ul className='event-types'>
                            <li><i className="fas fa-user-plus"></i> - new member joining the community,</li>
                            <li><i className="fas fa-plus-square"></i> - new game being curated,</li>
                            <li><i className="fas fa-check-square"></i> - member of the community finishing 100% of the game,</li>
                            <li><i className="fas fa-caret-square-up"></i> - game promoting a tier,</li>
                            <li><i className="fas fa-caret-square-down"></i> - game demoting a tier,</li>
                            <li><i className="fas fa-tasks"></i> - game having achievements added or removed.</li>
                        </ul>
                        <p>In case of event relating to a no longer curated game or user no longer being part of the group, the <i className='fas fa-exclamation-triangle'></i> icon is used.</p>
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