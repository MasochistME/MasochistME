import React from 'react'
import events from '../mock/events'

const sortEvents = event => {
    if (event.type === 'completion')
        return '100%'
    if (event.type === 'newgame')
        return 'new game'
}

export default class SidebarWrapper extends React.Component{
    render() {
        return (
            <div className='wrapper-sidebar'>
                <div className='section'>
                    <p className='section-title'>Last updated: 28 July 2018, 18:02</p>
                    <div className='update-progress-bar-border'>
                        <div className='update-progress-bar'></div>
                    </div>
                </div>
                <div className='section'>
                    <p className='section-title'>Last 10 events</p>
                    <div>
                        {
                            events.map(event => 
                                <div className='small-event'>
                                    { sortEvents(event) }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}