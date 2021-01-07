import React, { useState } from 'react';
import { SlideDown } from 'react-slidedown';
import MemberSummary from '../MemberSummary';
import MemberDetails from '../MemberDetails';

import 'react-slidedown/lib/slidedown.css';

type TMember = {
  id: any;
  position: number;
};
export default function user(props: TMember): JSX.Element {
  const { id, position } = props;
  const [show, setShow] = useState(false);

  const changeDetailsVisibility = (): any => setShow(!show);

  const details = show ? (
    <MemberDetails key={`details-${id}`} id={id} show={show} />
  ) : null;

  return (
    <li className="user flex-column">
      <MemberSummary
        id={id}
        position={position}
        onShowDetails={changeDetailsVisibility}
      />
      <SlideDown className={'my-dropdown-slidedown'} style={{ width: '100%' }}>
        {details}
      </SlideDown>
    </li>
  );
}
