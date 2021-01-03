import React from 'react';

export default class Loader extends React.Component {
  render() {
    if (this.props.isActive) {
      return (
        <div>
          <i className="fas fa-hourglass"></i>
        </div>
      );
    }
    return null;
  }
}
