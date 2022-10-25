import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { fonts } from 'shared/theme';
import { BadgeThumbnail } from 'containers';
import { Flex } from 'components';
import { ColorTokens } from 'styles/colors';
import { useAppContext } from 'context';

type Props = {
	badge: Badge;
};

export const BadgeTile = (props: Props) => {
	const { colorTokens } = useAppContext();
	const { badge } = props;

	return (
		<StyledBadge colorTokens={colorTokens}>
			<Flex column align justify gap={8}>
				<BadgeThumbnail badge={badge} key={`badge-image-${badge._id}`} />
				<BadgePoints badge={badge} />
			</Flex>
			<Flex column gap={2} width="100%">
				<h3 style={{ margin: '0 0 4px 0' }}>{badge.name?.toUpperCase()}</h3>
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
		<Flex align gap={4} fontSize="18px" fontFamily={fonts.Dosis}>
			{badge.points}
			<i className="fas fa-plus-circle" />
		</Flex>
	);
};

const StyledBadge = styled(Flex)<{ colorTokens: ColorTokens }>`
	width: 100%;
	max-width: 450px;
	padding: 12px;
	gap: 12px;
	align-items: flex-start;
	box-sizing: border-box;
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']}cc;
`;

const StyledBadgeField = styled.p`
	margin: 0;
	max-width: 450px;
	text-align: left;
`;
