import React, { useState } from 'react';
import { UnmountClosed } from 'react-collapse';
import styled from 'styled-components';

import { Flex } from 'components';
import { LeaderboardsMemberSummary } from './LeaderboardsMemberSummary';
import { LeaderboardsMemberCollapse } from './LeaderboardsMemberCollapse';

type Props = {
	steamId: string;
	position: number;
};
export const LeaderboardsMember = (props: Props): JSX.Element => {
	const { steamId, position } = props;
	const [isOpened, setIsOpened] = useState(false);

	const changeDetailsVisibility = () => {
		setIsOpened(!isOpened);
	};

	return (
		<StyledLeaderboardsMember>
			<LeaderboardsMemberSummary
				steamId={steamId}
				position={position}
				onShowDetails={changeDetailsVisibility}
			/>
			<UnmountClosed isOpened={isOpened} style={{ width: '100%' }}>
				<Flex align justify>
					<LeaderboardsMemberCollapse
						key={`details-${steamId}`}
						steamId={steamId}
					/>
				</Flex>
			</UnmountClosed>
		</StyledLeaderboardsMember>
	);
};

const StyledLeaderboardsMember = styled.li`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0;
	padding: 0;
	width: 100%;
	box-sizing: border-box;
	cursor: pointer;
	justify-content: space-between;
`;
