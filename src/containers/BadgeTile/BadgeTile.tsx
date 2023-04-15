import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { useTheme, ColorTokens, media } from 'styles';
import { BadgeThumbnail } from 'containers';
import { Flex, Icon, Size, Skeleton } from 'components';

type Props = {
	badge?: Badge;
	isCompact?: boolean;
};

export const BadgeTile = (props: Props) => {
	const { colorTokens } = useTheme();
	const { badge, isCompact = false } = props;

	if (!badge) return <BadgeTile.Skeleton />;
	return (
		<StyledBadge colorTokens={colorTokens} isCompact={isCompact}>
			<Flex column align justify gap={8}>
				<BadgeThumbnail badge={badge} key={`badge-image-${badge._id}`} />
				<BadgePoints badge={badge} />
			</Flex>
			<Flex column gap={12} width="100%">
				<StyledBadgeTitle>{badge.name?.toUpperCase()}</StyledBadgeTitle>
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

BadgeTile.Skeleton = ({ isCompact = false }: Pick<Props, 'isCompact'>) => {
	const { colorTokens } = useTheme();
	return (
		<StyledBadge colorTokens={colorTokens} isCompact={isCompact}>
			<Flex column align justify gap={8}>
				<BadgeThumbnail />
				<BadgePoints />
			</Flex>
			<Skeleton width="100%" height="8rem" />
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

const StyledBadge = styled(Flex)<{
	colorTokens: ColorTokens;
	isCompact: boolean;
}>`
	width: 100%;
	max-width: ${({ isCompact }) => (isCompact ? '32%' : '45rem')};
	padding: var(--size-12);
	gap: var(--size-12);
	align-items: flex-start;
	box-sizing: border-box;
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']}cc;

	@media (max-width: ${media.smallNetbooks}) {
		max-width: ${({ isCompact }) => (isCompact ? '45%' : '45rem')};
	}

	@media (max-width: ${media.tablets}) {
		max-width: ${({ isCompact }) => (isCompact ? '100%' : '45rem')};
	}
`;

const StyledBadgeTitle = styled.h3`
	all: unset;
	font-weight: 600;
	font-size: var(--font-size-16);
	line-height: var(--size-16);
`;

const StyledBadgeField = styled.p`
	margin: 0;
	max-width: 45rem;
	text-align: left;
	font-size: var(--font-size-14);
	line-height: var(--size-16);
`;

const StyledBadgePoints = styled(Flex)`
	gap: var(--size-4);
	line-height: var(--size-18);
	font-size: var(--font-size-18);
	font-family: var(--font-dosis);
`;
