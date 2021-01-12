import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGameDetails } from 'components/init';
import styled from 'styled-components';
import { media } from 'shared/theme';
import { StackedBarChart } from 'components/Charts';
import { Flex, Spinner, Wrapper, Section } from 'shared/components';
import List from '../Leaderboards/List';
import Badges from '../Leaderboards/Badges';
import GameHeader from './GameHeader';

const FlexibleFlex = styled(Flex)`
  width: 100%;
  @media (max-width: ${media.smallNetbooks}) {
    flex-direction: column;
  }
`;
const FlexibleSection = styled(Section)`
  @media (min-width: ${media.smallNetbooks}) {
    width: 100%;
  }
`;

export default function PageGame(): JSX.Element {
  const { id } = useParams<{ id: string }>();
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
    <Flex column>
      <GameHeader game={game} />
      <Wrapper type="page">
        {loaded && game ? (
          <FlexibleFlex>
            {game.badges?.length ? <Badges game={game} /> : null}
            <FlexibleSection
              style={{
                height: '250px',
                justifyContent: 'space-between',
              }}>
              <h3>
                Completions: {game?.completions ?? 'unknown'}
                <br />
                Average completion time
              </h3>
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
            </FlexibleSection>
          </FlexibleFlex>
        ) : (
          <Spinner />
        )}
        {game ? <List game={game} /> : <Spinner />}
      </Wrapper>
    </Flex>
  );
}
