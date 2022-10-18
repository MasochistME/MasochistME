import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { useMemberBadges } from 'sdk';
import { Flex, BadgeTile } from 'components';
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
		const title = `${badge.name} (${badge.points} pts)\n"${badge.description}"`;
		return (
			<BadgeTile
				src={badge.img}
				alt={`Badge image - ${badge.name}`}
				key={`badge-tile-${badge._id}`}
				title={title}
			/>
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
