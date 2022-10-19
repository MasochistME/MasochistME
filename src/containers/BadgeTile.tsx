import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { colors } from 'shared/theme';
import { BadgeThumbnail } from 'containers';
import { Flex } from 'components';

type Props = {
	badge: Badge;
};

export const BadgeTile = (props: Props) => {
	const { badge } = props;

	return (
		<StyledBadge>
			<Flex column align justify gap={12}>
				<BadgeThumbnail badge={badge} key={`badge-image-${badge._id}`} />
				<BadgePoints badge={badge} />
			</Flex>
			<Flex column gap={6} width="100%">
				<h3 style={{ margin: 0 }}>{badge.name?.toUpperCase()}</h3>
				<StyledBadgeField>
					<span style={{ fontWeight: 'bold' }}>Requirements</span> -{' '}
					{badge.requirements}
				</StyledBadgeField>

				<StyledBadgeField style={{ fontStyle: 'italic' }}>
					{badge.description}
				</StyledBadgeField>
			</Flex>
		</StyledBadge>
	);
};

export const BadgePoints = (props: Props) => {
	const { badge } = props;

	return (
		<Flex gap={8} fontSize="18px">
			<i className="fas fa-coins" />
			{badge.points}
		</Flex>
	);
};

const StyledBadge = styled(Flex)`
	width: 100%;
	padding: 12px;
	gap: 12px;
	align-items: flex-start;
	box-sizing: border-box;
	background-color: ${colors.superDarkGrey}cc;
`;

const StyledBadgeField = styled.p`
	margin: 0;
	max-width: 450px;
	text-align: left;
`;
