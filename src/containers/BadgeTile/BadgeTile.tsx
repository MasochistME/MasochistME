import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { useTheme, ColorTokens } from 'styles';
import { BadgeThumbnail } from 'containers';
import { Flex, Icon, Size, Skeleton } from 'components';

type Props = {
	badge?: Badge;
};

export const BadgeTile = (props: Props) => {
	const { colorTokens } = useTheme();
	const { badge } = props;

	if (!badge) return <BadgeTile.Skeleton />;
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

BadgeTile.Skeleton = () => {
	const { colorTokens } = useTheme();
	return (
		<StyledBadge colorTokens={colorTokens}>
			<Flex column align justify gap={8}>
				<BadgeThumbnail />
				<BadgePoints />
			</Flex>
			<Skeleton width="100%" height="80px" />
		</StyledBadge>
	);
};

export const BadgePoints = (props: Props) => {
	const { badge } = props;

	return (
		<StyledBadgePoints align gap={4}>
			{badge?.points ?? <Skeleton size={Size.TINY} />}
			<Icon icon="CirclePlus" size={Size.MICRO} />
		</StyledBadgePoints>
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

const StyledBadgePoints = styled(Flex)`
	gap: 4px;
	font-size: var(--size-18);
	font-family: var(--font-dosis);
`;
