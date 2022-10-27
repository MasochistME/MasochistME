import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useMemberLeaderboardsPoints } from 'hooks';
import { media } from 'styles';
import { Size } from 'components';
import { Flex, Icon, IconType, Spinner, Tooltip } from 'components';

type Props = {
	steamId: string;
};

export const LeaderboardsMemberPoints = (props: Props): JSX.Element => {
	const { steamId } = props;
	const { tierPoints, member, isLoading } =
		useMemberLeaderboardsPoints(steamId);

	/**
	 * All of the member's points, grouped by game tier.
	 */
	const groupedTierPoints = useMemo(() => {
		return tierPoints.map(tier => {
			return (
				<Tooltip
					key={`member-score-${tier.id}`}
					content={
						<>
							<span>Sum of all games completed in tier {tier.id}</span>
							<span>Points total: {tier?.points}</span>
						</>
					}>
					<StyledScore>
						<Icon icon={tier.icon as IconType} size={Size.MICRO} />
						{tier?.total}
					</StyledScore>
				</Tooltip>
			);
		});
	}, [tierPoints]);

	if (isLoading) return <Spinner />;
	return (
		<StyledLeaderboardsMemberPoints>
			{groupedTierPoints}
			<Tooltip
				content={
					<>
						<span>Sum of all badges earned</span>
						<span>Points total: {member?.badges?.points}</span>
					</>
				}>
				<StyledScore>
					<Icon icon="Medal" size={Size.MICRO} />
					{member?.badges?.total}
				</StyledScore>
			</Tooltip>
			<Tooltip content="Sum of all points">
				<StyledScore style={{ marginLeft: '16px' }}>
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
	@media (min-width: ${media.smallTablets}) {
		width: 260px;
		gap: 16px;
	}
	@media (max-width: ${media.smallTablets}) {
		gap: 2px;
	}
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
