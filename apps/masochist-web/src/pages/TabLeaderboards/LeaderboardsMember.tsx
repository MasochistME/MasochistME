import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import styled from 'styled-components';

import { media } from 'styles';
import { Flex } from 'components';
import { MemberLeaderboards } from 'containers';
import { TimePeriod } from 'utils/getTimePeriod';

import { LeaderboardsMemberSummary } from './LeaderboardsMemberSummary';

type Props = {
	steamId: string;
	position: number;
	timePeriod: TimePeriod;
};
export const LeaderboardsMember = (props: Props): JSX.Element => {
	const { steamId, position, timePeriod } = props;
	const [isOpened, setIsOpened] = useState(false);

	const changeDetailsVisibility = () => {
		setIsOpened(!isOpened);
	};

	return (
		<StyledLeaderboardsMember column align justify>
			<LeaderboardsMemberSummary
				steamId={steamId}
				position={position}
				timePeriod={timePeriod}
				onShowDetails={changeDetailsVisibility}
			/>
			<Collapse unmountOnExit={true} in={isOpened} style={{ width: '100%' }}>
				<Flex align justify>
					<MemberLeaderboards steamId={steamId} key={`details-${steamId}`} />
				</Flex>
			</Collapse>
		</StyledLeaderboardsMember>
	);
};

const StyledLeaderboardsMember = styled(Flex)`
	width: 100rem;
	max-width: 100%;
	box-sizing: border-box;
	justify-content: space-between;
	@media (max-width: ${media.smallNetbooks}) {
		flex-wrap: wrap;
	}
`;
