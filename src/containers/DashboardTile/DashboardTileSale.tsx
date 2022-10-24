import React from 'react';
import styled from 'styled-components';

import { colors, fonts } from 'shared/theme';
import { useGames } from 'sdk';
import { getGameThumbnail } from 'utils';
import { Section, SectionProps } from 'containers';
import { Flex, Loader, Spinner } from 'components';

export const DashboardTileSale = (
	props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
	const { gamesData, isLoading, isFetched } = useGames({
		filter: { isCurated: true, sale: true },
		sort: { sale: 'desc' },
	});

	const gamesOnSale = gamesData.map(game => {
		const gameImg = getGameThumbnail(game.id);
		return (
			<StyledGameSaleTile
				key={`sale-${game.id}`}
				style={{ backgroundImage: `url(${gameImg})` }}
				href={`https://store.steampowered.com/app/${game.id}`}
				target="_blank"
				rel="noopener noreferrer">
				<SalePercentage>-{game.sale}%</SalePercentage>
			</StyledGameSaleTile>
		);
	});

	return (
		<Section
			fullWidth
			title="Games on sale"
			content={
				<>
					{isLoading && <Loader />}
					{isFetched && (
						<StyledSectionSale align justify>
							{gamesOnSale.length ? gamesOnSale : <Spinner />}
						</StyledSectionSale>
					)}
				</>
			}
			{...props}
		/>
	);
};

export const StyledSectionSale = styled(Flex)`
	width: 100%;
	flex-wrap: wrap;
	gap: 8px;
`;

export const StyledGameSaleTile = styled.a`
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
	background-size: cover;
	background-repeat: no-repeat;
	box-sizing: border-box;
	min-width: 200px;
	height: 96px;
	border: 3px solid ${colors.black};
	&:hover {
		box-shadow: 0 0 10px ${colors.superDarkGrey};
	}
`;

export const SalePercentage = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 35%;
	height: 40%;
	font-family: ${fonts.Dosis};
	font-weight: bold;
	color: ${colors.superLightGrey};
	background-color: ${colors.superDarkGrey};
	border-left: 3px solid ${colors.black};
	border-bottom: 3px solid ${colors.black};
	font-size: 1.5em;
`;
