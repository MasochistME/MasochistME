import { Game, LogGameRemove, Tier } from '@masochistme/sdk/dist/v1/types';
import { Icon, IconType, Size } from 'components';
import { GameThumbnail } from 'containers';
import { useAllGames, useTiers } from 'sdk';
import { HistoryLog } from '.';

type Props = {
  log: LogGameRemove;
};

export const GameRemoveLog = (props: Props): JSX.Element | null => {
  const { log } = props;

  const { tiersData } = useTiers();
  const { gamesData: games } = useAllGames();

  const game = games.find((g: Game) => g.id === log.gameId);
  const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);

  const iconGameRemove = game ? 'SquareMinus' : 'WarningTriangle';
  const iconGameRating = (
    gameRating ? gameRating.icon : 'QuestionCircle'
  ) as IconType;

  const to = `/game/${log.gameId}`;

  return (
    <HistoryLog>
      <HistoryLog.Logo />
      <HistoryLog.Description>
        <HistoryLog.Link to={to}>
          {game ? game.title : `Game ${log.gameId}`}
        </HistoryLog.Link>
        <span>has been removed from curator!</span>
      </HistoryLog.Description>
      <HistoryLog.Summary>
        <HistoryLog.Icons>
          <Icon icon={iconGameRemove} />
          <Icon icon={iconGameRating} />
        </HistoryLog.Icons>
        <GameThumbnail game={game} size={Size.SMALL} />
      </HistoryLog.Summary>
    </HistoryLog>
  );
};
