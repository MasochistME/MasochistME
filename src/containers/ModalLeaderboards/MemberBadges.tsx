import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { useMemberBadges } from 'sdk';
import { Flex, Tooltip, BadgeTile } from 'components';
import { useBadges } from 'sdk';

type Props = {
	memberId: string;
	gameId: number;
};

export const MemberBadges = (props: Props): JSX.Element => {
	const { memberId, gameId } = props;

	const { memberBadgesData } = useMemberBadges(memberId);
	const { badgesData } = useBadges();

	const badges = badgesData.filter(
		(badge: Badge) =>
			badge.gameId === gameId &&
			memberBadgesData.find(b => b.badgeId === String(badge._id)),
	);

	const mappedBadges = badges.map((badge: Badge) => {
		return (
			<Tooltip
				content={
					<>
						<span>
							{badge.name} ({badge.points} pts)
						</span>
						<span style={{ maxWidth: '250px', fontStyle: 'italic' }}>
							{badge.description}
						</span>
					</>
				}>
				<BadgeTile
					src={badge.img}
					alt={`Badge image - ${badge.name}`}
					key={`badge-tile-${badge._id}`}
				/>
			</Tooltip>
		);
	});

	return <StyledFlex>{mappedBadges}</StyledFlex>;
};

const StyledFlex = styled(Flex)`
	& > * {
		margin-right: 4px;
	}
	&:first-child {
		margin-left: 4px;
	}
`;
