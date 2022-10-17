import React, { useState } from 'react';
import { SlideDown } from 'react-slidedown';
import styled from 'styled-components';

import { UserSummary } from './UserSummary';
import { UserDetails } from './UserDetails';

import 'react-slidedown/lib/slidedown.css';

type Props = {
	steamId: any;
	position: number;
};
export const User = (props: Props): JSX.Element => {
	const { steamId, position } = props;
	const [isVisible, setIsVisible] = useState(false);

	const changeDetailsVisibility = () => {
		setIsVisible(!isVisible);
	};

	const details = isVisible ? (
		<UserDetails
			key={`details-${steamId}`}
			steamId={steamId}
			isVisible={isVisible}
		/>
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
