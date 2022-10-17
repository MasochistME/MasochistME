import React, { useState } from 'react';
import { SlideDown } from 'react-slidedown';
import styled from 'styled-components';

import { UserSummary } from './UserSummary';
import { UserDetails } from './UserDetails';

import 'react-slidedown/lib/slidedown.css';

const StyledUser = styled.li`
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	width: 100%;
	box-sizing: border-box;
	cursor: pointer;
	justify-content: space-between;
`;

type Props = {
	steamId: any;
	position: number;
};
export const User = (props: Props): JSX.Element => {
	const { steamId, position } = props;
	const [show, setShow] = useState(false);

	const changeDetailsVisibility = (): any => setShow(!show);

	const details = show ? (
		<UserDetails key={`details-${steamId}`} steamId={steamId} show={show} />
	) : null;

	return (
		<StyledUser>
			<UserSummary
				steamId={steamId}
				position={position}
				onShowDetails={changeDetailsVisibility}
			/>
			{/** @ts-ignore */}
			<SlideDown className="my-dropdown-slidedown" style={{ width: '100%' }}>
				{details}
			</SlideDown>
		</StyledUser>
	);
};
