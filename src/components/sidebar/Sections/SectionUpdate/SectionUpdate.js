import React from 'react'
import axios from 'axios'

export default class SectionUpdate extends React.Component {
    constructor() {
        super()
        this.state = {
            updating: false,
            updateTimeout: 43200000
        }        
        this.checkStatus = this.checkStatus.bind(this);
        this.sendUpdateRequest = this.sendUpdateRequest.bind(this);
        
        // this.statusInterval = setInterval(() => this.checkStatus(), 1000);
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

    getUpdateDate(date) {
        return date
            ? new Date(date).toLocaleString()
            : "Unknown"
    }

    timeoutBeforeUpdate() {
        const timeout = Math.ceil((this.state.updateTimeout - (Date.now() - this.state.lastUpdate))/60000)
        return timeout;
    }

    blockUpdateIfTooSoon() {
        if (this.timeoutBeforeUpdate() > 0)
            return true
        return false
    }

    render() {
        return(
        <div className='section'>
            <h3 className='section-title'>Last updated: { this.getUpdateDate(this.state.lastUpdate) }</h3>
            <div className="flex-column">
            {
                this.state.updating
                    ? ( <div className='update-progress-bar-border' title={ `${this.state.updateStatus}%`}>
                            <div className='update-progress-bar' style={{ width:`${this.state.updateStatus}%` }}></div>
                            <div className='update-progress-bar-percentage'>Updating...</div>
                        </div>
                        )
                    : ( <button className={
                            this.blockUpdateIfTooSoon()
                                ? 'custom-button update-button button-blocked'
                                : 'custom-button update-button'} 
                        onClick={() => 
                            this.blockUpdateIfTooSoon()
                                ? null
                                : this.sendUpdateRequest()
                        }
                        title={
                            this.blockUpdateIfTooSoon()
                                ? `${Math.ceil((this.state.updateTimeout - (Date.now() - this.state.lastUpdate))/3600000)}:${Math.ceil(((this.state.updateTimeout - (Date.now() - this.state.lastUpdate))%3600000)/60000)} hours till you can update again`
                                : "Update"
                        }
                        >Update</button> )
            }
            </div>
            
                
        </div>)
    }
}
