import React from 'react';
import { SlideDown } from 'react-slidedown';
import MemberSummary from '../MemberSummary';
import MemberDetails from '../MemberDetails';

import 'react-slidedown/lib/slidedown.css';

export default class Member extends React.Component {
  constructor() {
    super();
    this.state = { show: false };
  }

  changeDetailsVisibility = () => this.setState({ show: !this.state.show });

  render() {
    const { member, index, rating, games, patron, badges } = this.props;
    const details = this.state.show ? (
      <MemberDetails
        key={`details-${member.id}`}
        member={member}
        show={this.state.show}
        rating={rating}
        badges={badges}
        games={games}
      />
    ) : null;

    return (
      <li className="member flex-column">
        <MemberSummary
          member={member}
          index={index}
          rating={rating}
          patron={patron}
          badges={badges}
          showDetailsCallback={this.changeDetailsVisibility}
        />
        <SlideDown
          className={'my-dropdown-slidedown'}
          style={{ width: '100%' }}>
          {details}
        </SlideDown>
      </li>
    );
  }
}
