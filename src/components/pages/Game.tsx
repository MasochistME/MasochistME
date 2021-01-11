import React from 'react';
// import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ChartWrapper, StackedBarChart } from 'components/Charts';
import { Flex, Spinner } from 'shared/components';
import Leaderboards from './Leaderboards';

const WrapperGame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export default function PageGame(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const game = useSelector((state: any) =>
    state.games.list.find((g: any) => Number(g.id) === Number(id)),
  );

  return (
    <Flex column>
      <GameHeader />
      <WrapperGame>
        {game ? (
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
        {game ? <Leaderboards id={id} rating={game.rating} /> : <Spinner />}
      </WrapperGame>
    </Flex>
  );
}

function GameHeader() {
  return <div></div>;
}
