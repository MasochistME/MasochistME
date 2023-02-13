import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

import { media } from 'styles';
import { useAppContext } from 'context';
import { Input } from 'containers';
import {
	Button,
	Checkbox,
	FilterBar,
	Flex,
	IconType,
	QueryBoundary,
	Size,
	Slider,
	Spinner,
} from 'components';
import {
	useActiveTab,
	GameView,
	useLoadTiers,
	useDebounce,
	useMixpanel,
} from 'hooks';
import { TabDict } from 'configuration/tabs';
import { useTiers } from 'sdk';

const DEFAULT_PRICES = [0, 1000];

type Props = {
	gameListView: GameView;
	toggleGameView: () => void;
};
export const GameFilterBar = (props: Props): JSX.Element => {
	useActiveTab(TabDict.GAMES);
	const { track } = useMixpanel();

	const { gameListView, toggleGameView } = props;
	const { queryGame, setQueryGame, visiblePrices, setVisiblePrices } =
		useAppContext();
	const [prices, setPrices] = useState<number[]>(DEFAULT_PRICES);
	const [showSlider, setShowSlider] = useState<boolean>(false);

	const trackPriceChange = () => {
		track('games.price.change', {
			min: visiblePrices[0],
			max: visiblePrices[1],
		});
	};
	useDebounce(prices, visiblePrices, setVisiblePrices, 500, trackPriceChange);

	const gameViewButtonIcon = useMemo(() => {
		if (gameListView === GameView.TILE) return 'Table';
		if (gameListView === GameView.TABLE) return 'Grid';
		return 'Spin';
	}, [gameListView]);

	const gameViewButtonLabel = useMemo(() => {
		if (gameListView === GameView.TILE) return 'Toggle table view';
		else return 'Toggle grid view';
	}, [gameListView]);

	const handleShowSliderClick = () => {
		setShowSlider(!showSlider);
	};

	return (
		<FilterBar>
			<StyledGameFilterBar>
				<Input
					placeholder="Search games"
					query={queryGame}
					setQuery={setQueryGame}
				/>
				<QueryBoundary fallback={<Spinner />}>
					<TierFilterBoundary />
				</QueryBoundary>
			</StyledGameFilterBar>
			<StyledGameFilterBar>
				<Slider.Expand
					iconExpand="CoinStack"
					showSlider={showSlider}
					setShowSlider={setShowSlider}>
					<Slider
						defaultValue={DEFAULT_PRICES}
						setValue={setPrices}
						getValueLabelFormat={(price: number) => `${price} €`}
						step={1}
					/>
				</Slider.Expand>
				<Button
					onClick={toggleGameView}
					icon={gameViewButtonIcon}
					label={gameViewButtonLabel}
				/>
			</StyledGameFilterBar>
		</FilterBar>
	);
};

const TierFilterBoundary = () => {
	useLoadTiers();
	const { visibleTiers, setVisibleTiers } = useAppContext();
	const { tiersData } = useTiers();

	return (
		<StyledGameFilterBarTiers>
			{tiersData.map((tier: Tier) => (
				<Checkbox
					key={`checkbox-filter-${tier.id}`}
					icon={tier.icon as IconType}
					itemType={tier.id}
					visibleItems={visibleTiers}
					setVisibleItems={setVisibleTiers}
				/>
			))}
		</StyledGameFilterBarTiers>
	);
};

const StyledGameFilterBar = styled(Flex)`
	gap: 32px;
	flex-wrap: wrap;
	align-items: center;
	@media (max-width: ${media.smallNetbooks}) {
		justify-content: center;
	}
`;

const StyledGameFilterBarTiers = styled(Flex)`
	justify-content: center;
	gap: 24px;
`;

const SliderWrapper = styled.div`
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 4px;
	border-radius: 32px;
	&.expanded {
		gap: 4px;
	}
`;

const SliderExpand = styled.div`
	visibility: hidden;
	width: 0;
	opacity: 0;
	transition: width 0.1s linear, opacity 0.1s linear;
	/* overflow: hidden; */

	&.expanded {
		visibility: visible;
		width: 200px;
		opacity: 1;
	}
`;
