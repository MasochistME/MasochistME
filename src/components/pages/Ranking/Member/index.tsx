import React, { useState } from 'react';
import { SlideDown } from 'react-slidedown';
import MemberSummary from '../MemberSummary';
import MemberDetails from '../MemberDetails';

import 'react-slidedown/lib/slidedown.css';

type TMember = {
  user: any;
  rating: any;
  games: any;
  patron: any;
  badges: any;
  index: number;
};
export default function user(props: TMember): JSX.Element {
  const { user, index, rating, games, patron, badges } = props;
  const [show, setShow] = useState(false);

  const changeDetailsVisibility = (): any => setShow(!show);

  const details = show ? (
    <MemberDetails
      key={`details-${user.id}`}
      user={user}
      show={show}
      rating={rating}
      badges={badges}
      games={games}
    />
  ) : null;

  return (
    <li className="user flex-column">
      <MemberSummary
        user={user}
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
