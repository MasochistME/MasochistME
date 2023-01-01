import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FeaturedType } from '@masochistme/sdk/dist/v1/types';

import { useFeaturedFiltered } from 'sdk';
import { Flex } from 'components';

import { FeaturedNews, FeaturedVideo } from 'containers/Featured';
import { ColorTokens, useTheme } from 'styles';

type Props = { gameId: number };

export const GameProfileFeatured = (props: Props) => {
	const { gameId } = props;
	const { colorTokens } = useTheme();

	const {
		featuredData: data,
		isFetched,
		isError,
	} = useFeaturedFiltered({
		filter: { isApproved: true, isVisible: true },
		sort: { date: 'desc' },
	});
	const featuredData = data.filter(f => f.gameId === gameId);

	const featuredContent = useMemo(() => {
		return featuredData.map(featured => {
			if (!featured || !isFetched || isError) return null;

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
	}, [featuredData, isFetched, isError]);

	return (
		<StyledGameProfileFeatured>{featuredContent}</StyledGameProfileFeatured>
	);
};

const StyledGameProfileFeaturedItem = styled.div<{ colorTokens: ColorTokens }>`
	padding: 8px;
	background-color: ${({ colorTokens }) => colorTokens['semantic-color--idle']};
	border-radius: 8px;
	width: 100%;
	max-width: 450px;
`;
const StyledGameProfileFeatured = styled(Flex)`
	justify-content: center;
	flex-wrap: wrap;
	gap: 12px;
`;
