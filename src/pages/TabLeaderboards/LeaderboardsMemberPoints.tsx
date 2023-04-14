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
				<StyledScore style={{ marginLeft: 'var(--size-16)' }}>
					<span
						style={{
							fontWeight: 'bold',
							fontSize: 'var(--font-size-18)',
							lineHeight: 'var(--size-14)',
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
		width: 26rem;
		gap: var(--size-16);
	}
	@media (max-width: ${media.smallTablets}) {
		gap: var(--size-2);
	}
`;

const StyledScore = styled(Flex)`
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: var(--size-4);
	width: var(--size-20);

	i {
		margin: 0;
		padding: 0;
	}
`;
