import React from 'react'
import events from '../../../../shared/mock/events'

export default class SectionHistory extends React.Component {
    sortEvents = event => {
        if (event.type === 'completion')
            return '100%'
        if (event.type === 'newgame')
            return 'new game'
    }

    render() {
        return(
        <div className='section'>
            <p className='section-title'>Last 10 events</p>
            <div>
                {
                    events.map(event => 
                        <div className='small-event'>
                            { this.sortEvents(event) }
                        </div>
                    )
                }
            </div>
        </div>)
    }
}