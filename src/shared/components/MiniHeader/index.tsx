import React from 'react';
import { connect } from 'react-redux';

class MiniHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      title: 'Game List',
      icon: 'fas fa-gamepad',
    };
  }

  render() {
    const { props } = this;
    const findTab = () =>
      props.state.tabs.find(tab => tab.link === props.state.activeTab);

    return (
      <div className="wrapper-miniheader flex-row">
        <div className="flex-row">
          <i className={findTab().icon} />
          <p>{findTab().text}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ state });

export default connect(mapStateToProps)(MiniHeader);
