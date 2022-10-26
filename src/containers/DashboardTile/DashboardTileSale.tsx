import React from 'react';
import styled from 'styled-components';

import { fonts } from 'styles/theme/themeOld';
import { useGames } from 'sdk';
import { getGameThumbnail } from 'utils';
import { Section, SectionProps } from 'containers';
import { Flex, Loader, Spinner } from 'components';
import { useTheme, ColorTokens } from 'styles';

export const DashboardTileSale = (
	props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
	const { colorTokens } = useTheme();
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
				rel="noopener noreferrer"
				colorTokens={colorTokens}>
				<SalePercentage colorTokens={colorTokens}>-{game.sale}%</SalePercentage>
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

export const StyledGameSaleTile = styled.a<{ colorTokens: ColorTokens }>`
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
	background-size: cover;
	background-repeat: no-repeat;
	box-sizing: border-box;
	min-width: 200px;
	height: 96px;
	border: 3px solid ${({ colorTokens }) => colorTokens['core-tertiary-bg']};
	&:hover {
		box-shadow: 0 0 10px
			${({ colorTokens }) => colorTokens['core-secondary-bg']};
	}
`;

export const SalePercentage = styled.span<{ colorTokens: ColorTokens }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 35%;
	height: 40%;
	font-family: ${fonts.Dosis};
	font-weight: bold;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	border-left: 3px solid ${({ colorTokens }) => colorTokens['core-tertiary-bg']};
	border-bottom: 3px solid
		${({ colorTokens }) => colorTokens['core-tertiary-bg']};
	font-size: 1.5em;
`;
