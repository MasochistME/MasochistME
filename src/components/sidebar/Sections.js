import React from 'react'
import events from '../../mock/events'

export class SectionUpdate extends React.Component {
    render() {
        return(
        <div>
            <p className='section-title'>Last updated: 28 July 2018, 18:02</p>
                <div className='update-progress-bar-border'>
                    <div className='update-progress-bar'></div>
                </div>
        </div>)
    }
}

export class SectionTop extends React.Component { 
    render() {
        return(
        <div>
            <p className='section-title'>Top 10 members</p>
            <div>
            </div>
        </div>)
    }
}

export class SectionHistory extends React.Component {
    sortEvents = event => {
        if (event.type === 'completion')
            return '100%'
        if (event.type === 'newgame')
            return 'new game'
    }

    render() {
        return(
        <div>
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