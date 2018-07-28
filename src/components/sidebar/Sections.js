import React from 'react'
import events from '../../mock/events'

export class SectionUpdate extends React.Component {
    constructor(){
        super()
        this.state = {
            percentage: 0
        }
        const interval = setInterval(() => this.state.percentage < 100 
                ? this.setState({ percentage: this.state.percentage + 1 })
                : clearInterval(interval)
            , 1000)
    }
    render() {
        return(
        <div className='section'>
            <p className='section-title'>Last updated: 28 July 2018, 18:02</p>
                <div className='update-progress-bar-border' title={ `${this.state.percentage}%`}>
                    <div className='update-progress-bar' style={{ width:`${this.state.percentage}%` }}></div>
                </div>
        </div>)
    }
}

export class SectionTop extends React.Component { 
    render() {
        return(
        <div className='section'>
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