import React from 'react';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { getGameThumbnail } from 'utils';
import {
	Section,
	SectionTitle,
	SaleBrick,
	SaleLink,
	SalePercentage,
} from 'containers/Sidebar/components';
import { Spinner } from 'components';
import { useGames } from 'shared/hooks';

export const SectionSale = (): JSX.Element => {
	const { gamesData } = useGames();

	// TODO Use games sale endpoint here!!!
	const gamesOnSale = gamesData
		// .filter(game => game.sale.onSale)
		.filter(() => false)
		.map((game: Game, index) => {
			const gameImg = getGameThumbnail(game.id);
			return (
				<SaleBrick
					key={`sale-${index}`}
					style={{ backgroundImage: `url(${gameImg})` }}>
					<SaleLink
						href={`https://store.steampowered.com/app/${game.id}`}
						target="_blank"
						rel="noopener noreferrer">
						{/* <SalePercentage>-{game.sale.discount}%</SalePercentage> */}
						<SalePercentage>-0%</SalePercentage>
					</SaleLink>
				</SaleBrick>
			);
		});

	return (
		<Section>
			<SectionTitle>Games on sale</SectionTitle>
			<SectionSaleUl>
				{gamesOnSale.length ? gamesOnSale : <Spinner />}
			</SectionSaleUl>
		</Section>
	);
};

export const SectionSaleUl = styled.ul`
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	list-style-type: none;
`;
