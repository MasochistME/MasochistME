import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import styled from 'styled-components';

import { media } from 'styles';
import { Flex, Skeleton, QueryBoundary } from 'components';
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
			<QueryBoundary fallback={<SkeletonSummary />}>
				<LeaderboardsMemberSummary
					steamId={steamId}
					position={position}
					onShowDetails={changeDetailsVisibility}
				/>
			</QueryBoundary>
			<Collapse unmountOnExit={true} in={isOpened} style={{ width: '100%' }}>
				<Flex align justify>
					<QueryBoundary fallback={<SkeletonLeaderboards />}>
						<MemberLeaderboards steamId={steamId} key={`details-${steamId}`} />
					</QueryBoundary>
				</Flex>
			</Collapse>
		</StyledLeaderboardsMember>
	);
};

const SkeletonSummary = () => (
	<Skeleton width="100%" height="50px" style={{ margin: '2px 0' }} />
);

const SkeletonLeaderboards = () => (
	<>
		{[null, null, null, null, null].map(() => (
			<Skeleton width="100%" height="20px" style={{ margin: '1px 0' }} />
		))}
	</>
);

const StyledLeaderboardsMember = styled(Flex)`
	width: 1000px;
	max-width: 100%;
	box-sizing: border-box;
	justify-content: space-between;
	@media (max-width: ${media.smallNetbooks}) {
		flex-wrap: wrap;
	}
`;
