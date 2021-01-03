import React from 'react';
// import Login from '../Login'

export default class Header extends React.Component {
  render() {
    return (
      <div className="header flex-row">
        {/* <i className='fab fa-steam' /> */}
        <p className="header-motto">0.1% - games that masochists love</p>
        {/* <Login /> */}
      </div>
    );
  }
}
