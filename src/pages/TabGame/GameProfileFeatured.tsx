import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FeaturedType } from '@masochistme/sdk/dist/v1/types';

import { useFeaturedFiltered } from 'sdk';
import { Flex, QueryBoundary, Spinner } from 'components';

import { FeaturedNews, FeaturedVideo } from 'containers/Featured';
import { ColorTokens, useTheme } from 'styles';

type Props = { gameId: number };

export const GameProfileFeatured = (props: Props) => (
	<QueryBoundary fallback={<Spinner />}>
		<GameProfileFeaturedBoundary {...props} />
	</QueryBoundary>
);

const GameProfileFeaturedBoundary = (props: Props) => {
	const { gameId } = props;
	const { colorTokens } = useTheme();

	const { featuredData: data } = useFeaturedFiltered({
		filter: { isApproved: true, isVisible: true },
		sort: { date: 'desc' },
	});
	const featuredData = data.filter(f => f.gameId === gameId);

	const featuredContent = useMemo(() => {
		return featuredData.map(featured => {
			if (!featured) return null;

			if (featured.type === FeaturedType.NEWS)
				return (
					<StyledGameProfileFeaturedItem colorTokens={colorTokens}>
						<FeaturedNews featured={featured} isCompact />
					</StyledGameProfileFeaturedItem>
				);
			if (featured.type === FeaturedType.VIDEO)
				return (
					<StyledGameProfileFeaturedItem colorTokens={colorTokens}>
						<FeaturedVideo featured={featured} isCompact hideGame />
					</StyledGameProfileFeaturedItem>
				);
		});
	}, [featuredData]);

	return (
		<StyledGameProfileFeatured>
			{featuredData.length
				? featuredContent
				: 'There is no featured content for this game!'}
		</StyledGameProfileFeatured>
	);
};

const StyledGameProfileFeaturedItem = styled.div<{ colorTokens: ColorTokens }>`
	padding: var(--size-8);
	background-color: ${({ colorTokens }) => colorTokens['semantic-color--idle']};
	border-radius: var(--border-radius-8);
	width: 100%;
	max-width: 45rem;
`;
const StyledGameProfileFeatured = styled(Flex)`
	justify-content: center;
	flex-wrap: wrap;
	gap: var(--size-12);
`;
