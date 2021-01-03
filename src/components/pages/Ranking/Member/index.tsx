import React, { useState } from 'react';
import { SlideDown } from 'react-slidedown';
import MemberSummary from '../MemberSummary';
import MemberDetails from '../MemberDetails';

import 'react-slidedown/lib/slidedown.css';

type TMember = {
  member: any;
  rating: any;
  games: any;
  patron: any;
  badges: any;
  index: number;
};
export default function Member(props: TMember): JSX.Element {
  const { member, index, rating, games, patron, badges } = props;
  const [show, setShow] = useState(false);

  const changeDetailsVisibility = (): any => setShow(!show);

  const details = show ? (
    <MemberDetails
      key={`details-${member.id}`}
      member={member}
      show={show}
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
        onShowDetails={changeDetailsVisibility}
      />
      <SlideDown className={'my-dropdown-slidedown'} style={{ width: '100%' }}>
        {details}
      </SlideDown>
    </li>
  );
}
