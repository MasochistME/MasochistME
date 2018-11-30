import React from 'react'
import axios from 'axios'

export default class SectionUpdate extends React.Component {
    constructor() {
        super()
        this.state = {
            updating: false
        }        
        this.checkStatus = this.checkStatus.bind(this);
        this.sendUpdateRequest = this.sendUpdateRequest.bind(this);
        
        this.statusInterval = setInterval(() => this.checkStatus(), 1000);
    }

    checkStatus() {
        let url = `/rest/status`
        axios.get(url)
            .then(res => this.setState({ ...res.data }))
            .catch(err => console.log(err))
    }

    sendUpdateRequest() {
        let url = `/rest/update`
        axios.get(url)
            .then(res => console.log(res.data.content))
            .catch(err => console.log(err))
    }

    render() {
        return(
        <div className='section'>
            <h3 className='section-title'>Last updated: { new Date(this.state.lastUpdate).toLocaleString() }</h3>
            <div className="flex-column">
            {
                this.state.updating
                    ? ( <div className='update-progress-bar-border' title={ `${this.state.updateStatus}%`}>
                            <div className='update-progress-bar' style={{ width:`${this.state.updateStatus}%` }}></div>
                        </div>
                        )
                    : ( <button className='custom-button update-button' onClick={() => this.sendUpdateRequest() }>Update</button> )
            }
            </div>
            
                
        </div>)
    }
}
