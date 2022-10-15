import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import {
	Section,
	SectionTitle,
	SaleBrick,
	SaleLink,
	SalePercentage,
} from '../';
import Spinner from 'shared/components/Spinner';

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

export default function SectionSale(): JSX.Element {
	const games = useSelector((state: any) =>
		orderBy(state.games.list, ['sale.discount'], ['desc']),
	);

	const gamesOnSale = games
		.filter(game => game.sale.onSale)
		.map((game, index) => (
			<SaleBrick
				key={`sale-${index}`}
				style={{ backgroundImage: `url(${game.img})` }}>
				<SaleLink
					href={`https://store.steampowered.com/app/${game.id}`}
					target="_blank"
					rel="noopener noreferrer">
					<SalePercentage>-{game.sale.discount}%</SalePercentage>
				</SaleLink>
			</SaleBrick>
		));

	return (
		<Section>
			<SectionTitle>Games on sale</SectionTitle>
			<SectionSaleUl>
				{gamesOnSale.length ? gamesOnSale : <Spinner />}
			</SectionSaleUl>
		</Section>
	);
}
