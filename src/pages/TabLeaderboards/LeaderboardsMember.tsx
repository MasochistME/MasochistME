import React, { useState } from 'react';
import { UnmountClosed as Collapse } from 'react-collapse';
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
		<StyledLeaderboardsMember column align justify>
			<LeaderboardsMemberSummary
				steamId={steamId}
				position={position}
				onShowDetails={changeDetailsVisibility}
			/>
			<Collapse isOpened={isOpened} style={{ width: '100%' }}>
				<Flex align justify>
					<LeaderboardsMemberCollapse
						steamId={steamId}
						key={`details-${steamId}`}
					/>
				</Flex>
			</Collapse>
		</StyledLeaderboardsMember>
	);
};

const StyledLeaderboardsMember = styled(Flex)`
	width: 100%;
	box-sizing: border-box;
	justify-content: space-between;
`;
