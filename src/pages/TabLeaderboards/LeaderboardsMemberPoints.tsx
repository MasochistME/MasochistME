import React from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useLeaderboards } from 'sdk';
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
		leaderboardsData,
		isLoading: isLeaderboardsLoading,
		isFetched: isLeaderboardsFetched,
	} = useLeaderboards();

	const member = leaderboardsData.find(l => l.memberId === steamId);

	const isLoading = isLeaderboardsLoading && isTiersLoading;
	const isFetched = isLeaderboardsFetched && isTiersFetched;

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
					<i className={tier.icon} />
					{tierPoints?.total}
				</StyledScore>
			</Tooltip>
		);
	});

	if (isLoading) return <Spinner />;
	return (
		<StyledLeaderboardsMemberPoints>
			{tierPoints}
			<Tooltip
				content={
					<>
						<span>Sum of all badges earned</span>
						<span>Points total: {member?.badges?.points}</span>
					</>
				}>
				<StyledScore>
					<i className="fas fa-medal" />
					{member?.badges?.total}
				</StyledScore>
			</Tooltip>
			<Tooltip content="Sum of all points">
				<StyledScore>
					<span
						style={{
							fontWeight: 'bold',
							fontSize: '18px',
							lineHeight: '14px',
						}}>
						Σ
					</span>
					<span style={{ fontWeight: 'bold' }}>{member?.sum ?? 0}</span>
				</StyledScore>
			</Tooltip>
		</StyledLeaderboardsMemberPoints>
	);
};

const StyledLeaderboardsMemberPoints = styled(Flex)`
	gap: 16px;
`;

const StyledScore = styled(Flex)`
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
	width: 20px;
	i {
		margin: 0;
		padding: 0;
	}
`;
