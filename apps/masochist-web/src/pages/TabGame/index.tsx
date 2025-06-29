import { Badge, Game } from '@masochistme/sdk/dist/v1/types';
import {
    ErrorFallback,
    Flex,
    Loader,
    QueryBoundary,
    Warning,
} from 'components';
import { TabDict } from 'configuration/tabs';
import { BadgeTile, Section, SectionProps, SubPage } from 'containers';
import { useActiveTab } from 'hooks';
import { useParams } from 'react-router-dom';
import { useCuratedGames, useGameBadges } from 'sdk';
import styled from 'styled-components';
import { GameProfileHeader } from './GameProfileHeader';
import { GameProfileStats } from './GameProfileStats';
import { TabGameTabsBoundary } from './GameProfileTabs';

export const TabGame = (): JSX.Element => {
  // ID param will always be defined because this tab is used ONLY for the /game/:id route.
  const { id } = useParams<{ id: string }>() as { id: string };
  useActiveTab(TabDict.GAME);

  return (
    <SubPage>
      <QueryBoundary
        fallback={
          <Flex align justify width="100%">
            <Loader />
          </Flex>
        }
        errorFallback={<Warning description={`Could not load this game.`} />}>
        <TabGameBoundary id={id} />
      </QueryBoundary>
    </SubPage>
  );
};

const TabGameBoundary = ({ id }: { id: string }) => {
  const { gamesData } = useCuratedGames();

  const gameId = Number(id);
  const game = gamesData.find((g: Game) => g.id === gameId);

  if (!game)
    return <Warning description={`Game with id ${id} does not exist.`} />;
  return (
    <>
      <Flex column width="100%" gap={16}>
        <QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
          <TabGameTopBoundary game={game} />
        </QueryBoundary>
        <QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
          <TabGameTabsBoundary gameId={gameId} />
        </QueryBoundary>
      </Flex>
      <Info gameId={gameId} />
    </>
  );
};

const TabGameTopBoundary = ({ game }: { game: Game }) => (
  <Flex column>
    <GameProfileHeader game={game} />
    <GameProfileStats game={game} />
  </Flex>
);

const Info = (props: Partial<SectionProps> & { gameId: number }) => {
  const { gameId, ...rest } = props;
  return (
    <Section
      width="100%"
      maxWidth="45rem"
      title="Badges"
      content={
        <QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
          <InfoBoundary gameId={gameId} />
        </QueryBoundary>
      }
      {...rest}
    />
  );
};

const InfoBoundary = ({ gameId }: { gameId: number }) => {
  const { gameBadgesData } = useGameBadges(gameId);
  return (
    <StyledGameProfileBadges>
      {gameBadgesData.length
        ? gameBadgesData.map((badge: Badge) => (
            <BadgeTile badge={badge} key={`badge-${badge._id}`} />
          ))
        : 'This game has no badges yet.'}
    </StyledGameProfileBadges>
  );
};

const StyledGameProfileBadges = styled(Flex)`
  gap: var(--size-8);
  width: 100%;
  flex-flow: row wrap;
`;
