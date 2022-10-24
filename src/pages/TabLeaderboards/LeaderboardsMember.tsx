import React, { useState } from 'react';
import { UnmountClosed as Collapse } from 'react-collapse';
import styled from 'styled-components';

import { media } from 'shared/theme';
import { Flex } from 'components';
import { MemberLeaderboards } from 'containers';
import { LeaderboardsMemberSummary } from './LeaderboardsMemberSummary';

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
					<MemberLeaderboards steamId={steamId} key={`details-${steamId}`} />
				</Flex>
			</Collapse>
		</StyledLeaderboardsMember>
	);
};

const StyledLeaderboardsMember = styled(Flex)`
	width: 1000px;
	max-width: 100%;
	box-sizing: border-box;
	justify-content: space-between;
	@media (max-width: ${media.smallNetbooks}) {
		flex-wrap: wrap;
	}
`;
