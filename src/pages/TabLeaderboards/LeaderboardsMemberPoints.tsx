import React from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useMemberLeaderboards } from 'sdk';
import { media } from 'shared/theme';
import { Flex, Spinner, Tooltip } from 'components';

type Props = {
	steamId: string;
};

export const LeaderboardsMemberPoints = (props: Props): JSX.Element => {
	const { steamId } = props;

	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();
	const {
		leaderData: member,
		isLoading: isMemberLoading,
		isFetched: isMemberFetched,
	} = useMemberLeaderboards(steamId);

	const isLoading = isMemberLoading && isTiersLoading;
	const isFetched = isMemberFetched && isTiersFetched;

	const tierPoints = tiersData.map((tier: Tier) => {
		const tierPoints = member?.games?.find(game => game.tier === tier.id);
		return (
			<Tooltip
				content={
					<>
						<span>Sum of all games completed in tier {tier.id}</span>
						<span>Points total: {tierPoints?.points}</span>
					</>
				}>
				<StyledScore key={`member-score-${tier.id}`}>
					{tierPoints?.total}
					<i className={tier.icon} style={{ paddingRight: '5px' }} />
				</StyledScore>
			</Tooltip>
		);
	});

	if (isLoading) return <Spinner />;
	return (
		<StyledLeaderboardsMemberPoints>
			<Tooltip content="Sum of all points">
				<StyledScore>
					{member?.sum ?? 0}
					<i className="fas fa-sigma" />
				</StyledScore>
			</Tooltip>
			{tierPoints}
			<Tooltip
				content={
					<>
						<span>Sum of all badges earned</span>
						<span>Points total: {member?.badges?.points}</span>
					</>
				}>
				<StyledScore>
					{member?.badges?.total}
					<i className="fas fa-medal" />
				</StyledScore>
			</Tooltip>
		</StyledLeaderboardsMemberPoints>
	);
};

const StyledLeaderboardsMemberPoints = styled(Flex)`
	justify-content: space-evenly;
`;

const StyledScore = styled(Flex)`
	justify-content: center;
	align-items: center;
	gap: 4px;
	margin: 0 8px;
	@media (max-width: ${media.tablets}) {
		display: none !important;
	}
`;
