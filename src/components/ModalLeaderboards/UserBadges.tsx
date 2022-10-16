import React from 'react';
import styled from 'styled-components';

import { Flex, Badge } from 'shared/components';
import { useBadges } from 'shared/hooks';

type Props = {
	user: any;
	game: any;
};

export const UserBadges = (props: Props): JSX.Element => {
	const { user, game } = props;
	const { data } = useBadges();

	const badges = data.filter(
		(badge: any) =>
			game?.badges?.includes(badge['_id']) &&
			user?.badges?.includes(badge['_id']),
	);

	const mappedBadges = badges.map((badge: any) => {
		const title = `${badge.name} (${badge.points} pts)\n"${badge.description}"`;
		return (
			<Badge
				src={badge.img}
				alt={badge._id}
				key={`img-badge-${badge._id}`}
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
