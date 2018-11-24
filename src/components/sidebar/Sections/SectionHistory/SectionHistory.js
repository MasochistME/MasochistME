import React from 'react'
import { connect } from 'react-redux'

class SectionHistory extends React.Component {
    sortEvents = event => {
        if (event.type === 'newMember')
            return '100%'
        if (event.type === 'newGame')
            return 'new game'
        if (event.type === 'complete')
            return 'complete'
    }

    render() {
        const { props } = this;
        return (
        <div className='section'>
            <p className='section-title'>Last 10 events</p>
            <div>
                {
                    props.events.map(event => 
                        <div className='small-event'>
                            { this.sortEvents(event) }
                        </div>
                    )
                }
            </div>
        </div>)
    }
}


const mapStateToProps = state => ({ 
    events: state.events
})

export default connect(
  mapStateToProps
)( SectionHistory )