import { Tier } from '@masochistme/sdk/dist/v1/types';
import {
    Button,
    Checkbox,
    FilterBar,
    Flex,
    IconType,
    Input,
    QueryBoundary,
    Slider,
    Spinner,
} from 'components';
import { TabDict } from 'configuration/tabs';
import { useAppContext } from 'context';
import { GameView, useActiveTab, useDebounce, useLoadTiers } from 'hooks';
import { t } from 'i18n';
import { useMemo, useState } from 'react';
import { useTiers } from 'sdk';
import styled from 'styled-components';
import { media } from 'styles';

const DEFAULT_PRICES = [0, 1000];

type Props = {
  gameListView: GameView;
  toggleGameView: () => void;
};
export const GameFilterBar = (props: Props): JSX.Element => {
  useActiveTab(TabDict.GAMES);

  const { gameListView, toggleGameView } = props;
  const { queryGame, setQueryGame, visiblePrices, setVisiblePrices } =
    useAppContext();
  const [prices, setPrices] = useState<number[]>(DEFAULT_PRICES);
  const [showSlider, setShowSlider] = useState<boolean>(false);

  useDebounce(prices, visiblePrices, setVisiblePrices, 500);

  const gameViewButtonIcon = useMemo(() => {
    if (gameListView === GameView.TILE) return 'Table';
    if (gameListView === GameView.TABLE) return 'Grid';
    return 'Spin';
  }, [gameListView]);

  const gameViewButtonLabel = useMemo(() => {
    if (gameListView === GameView.TILE) return t('games.view.toggle_table');
    else return t('games.view.toggle_grid');
  }, [gameListView]);

  return (
    <FilterBar>
      <StyledGameFilterBar>
        <Input
          placeholder={t('games.filter.search_placeholder')}
          query={queryGame}
          setQuery={setQueryGame}
          icon="Search"
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
  gap: var(--size-16);
  flex-wrap: wrap;
  align-items: center;
  @media (max-width: ${media.smallNetbooks}) {
    justify-content: center;
  }
`;

const StyledGameFilterBarTiers = styled(Flex)`
  justify-content: center;
  gap: var(--size-16);
`;
