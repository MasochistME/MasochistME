import React from 'react';
import { useSelector } from 'react-redux';
import { ChartWrapper, StackedBarChart } from 'components/Charts';
import { Spinner } from 'shared/components';
import { useGameDetails } from 'components/init';
import { WrapperLeaderboards } from './styles';
import List from './List';
import Badges from './Badges';

type Props = {
  id: any;
  rating: any;
};

// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

Leaderboards.List = List;

export default function Leaderboards(props: Props): JSX.Element | null {
  const { id } = props;
  const loaded = useGameDetails(id);
  const game = useSelector((state: any) => {
    const gameBasic = state.games.list.find(
      (g: any) => Number(g.id) === Number(id),
    );
    const gameDetails = state.games.details.find(
      (g: any) => Number(g.id) === Number(id),
    );
    return {
      ...gameBasic,
      ...gameDetails,
    };
  });

  return (
    <WrapperLeaderboards>
      <h2>
        <a
          href={`https://store.steampowered.com/app/${game?.id ?? ''}`}
          target="_blank"
          rel="noopener noreferrer">
          {game?.title ?? 'Loading...'}{' '}
          <i className="fas fa-external-link-alt"></i>
        </a>
      </h2>
      {loaded && game ? (
        <div className="game-statistics">
          <ChartWrapper
            title={[
              `Completions: ${game?.completions ?? 'unknown'}`,
              'Average completion time',
            ]}>
            <StackedBarChart
              labels={['hours']}
              datasets={[
                {
                  label: 'this game',
                  data: [game.avgPlaytime],
                  colorNormal: '#e30000ff',
                  colorTransparent: '#e3000033',
                },
                {
                  label: 'games from this tier',
                  data: [game?.avgPlaytime ?? 0], // TODO
                  colorNormal: '#141620ff',
                  colorTransparent: '#14162066',
                },
              ]}
            />
          </ChartWrapper>
        </div>
      ) : (
        <Spinner />
      )}
      {loaded && game ? (
        game.badges?.length ? (
          <Badges game={game} />
        ) : null
      ) : (
        <Spinner />
      )}
      {loaded && game ? <Leaderboards.List game={game} /> : <Spinner />}
    </WrapperLeaderboards>
  );
}
