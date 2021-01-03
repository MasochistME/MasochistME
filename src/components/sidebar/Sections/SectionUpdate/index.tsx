import React from 'react';
import axios from 'axios';

export default class SectionUpdate extends React.Component {
  constructor() {
    super();
    this.state = {
      updating: false,
      updateTimeout: 43200000,
      lastUpdated: 'unknown',
    };
  }

  sendUpdateRequest() {
    const url = '/rest/update';
    axios
      .get(url)
      .then(res => console.log(res.data.content))
      .catch(err => console.log(err));
  }

  getUpdateDate() {
    const url = '/rest/status';
    axios
      .get(url)
      .then(res => this.setState({ lastUpdated: res.data.lastUpdated }))
      .catch(err => {
        this.setState({ lastUpdated: 'unknown' });
        console.log(err);
      });
  }

  timeoutBeforeUpdate() {
    const timeout = Math.ceil(
      (this.state.updateTimeout - (Date.now() - this.state.lastUpdated)) /
        60000,
    );
    return timeout;
  }

  blockUpdateIfTooSoon() {
    if (this.timeoutBeforeUpdate() > 0) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.getUpdateDate();
  }

  render() {
    const nextUpdate =
      this.state.lastUpdated !== 'unknown'
        ? new Date(this.state.lastUpdated + 43200000).toLocaleString()
        : 'unknown';

    return (
      <div className="section">
        <h3
          className="section-title"
          style={{ height: '100%' }}>{`Next update: ${nextUpdate}`}</h3>
        {/* <h3 className='section-title'>Last updated: { new Date(this.state.lastUpdated).toLocaleString() }</h3>
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
                                ? `${Math.ceil((this.state.updateTimeout - (Date.now() - this.state.lastUpdated))/3600000)}:${Math.ceil(((this.state.updateTimeout - (Date.now() - this.state.lastUpdated))%3600000)/60000)} hours till you can update again`
                                : "Update"
                        }
                        >Update</button> )
            }
            </div> */}
      </div>
    );
  }
}
