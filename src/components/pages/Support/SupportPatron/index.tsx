import React from 'react';

class SupportPatreonAvatar extends React.Component {
  render() {
    return (
      <img
        className={`patron-avatar avatar-tier${this.props.tier}`}
        src={this.props.avatar}
        alt="avatar"
      />
    );
  }
}

class SupportPatron extends React.Component {
  render() {
    const { props } = this;
    const patron = props.patron;
    const tier = props.tier;

    return (
      <div className="patron">
        <SupportPatreonAvatar avatar={patron.avatar} tier={tier} />
        <p className="patron-nickname">{patron.name}</p>
      </div>
    );
  }
}

export default SupportPatron;
