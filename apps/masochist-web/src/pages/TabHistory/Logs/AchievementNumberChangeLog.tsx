import {
  Game,
  LogAchievementNumberChange,
  Tier,
} from '@masochistme/sdk/dist/v1/types';
import { Icon, IconType, Size } from 'components';
import { GameThumbnail } from 'containers';
import { useNavigate } from 'react-router';
import { useAllGames, useTiers } from 'sdk';
import { HistoryLog } from '.';

type Props = {
  log: LogAchievementNumberChange;
};

export const AchievementNumberChangeLog = (
  props: Props,
): JSX.Element | null => {
  const { log } = props;
  const navigate = useNavigate();

  const { tiersData } = useTiers();
  const { gamesData: games } = useAllGames();

  const game = games.find((g: Game) => g.id === log.gameId);
  const tier = tiersData.find((t: Tier) => t.id === game?.tier);

  const iconTier = tier?.icon ?? 'QuestionCircle'; // TODO this wont be compatible
  const iconAchievementChange = game ? 'Checklist' : 'WarningTriangle'; // TODO this won't be compatible

  const onGameClick = () => {
    if (game?.id) navigate(`/game/${game.id}`);
  };

  if (!game || !tier) return null;

  return (
    <HistoryLog>
      <HistoryLog.Logo />
      <HistoryLog.Description>
        <HistoryLog.Link onClick={onGameClick}>
          {game.title ?? `Game ${game.id}`}
        </HistoryLog.Link>
        {log.oldNumber < log.newNumber
          ? `got ${log.newNumber - log.oldNumber} new achievements!`
          : `had ${log.oldNumber - log.newNumber} achievements removed!`}
      </HistoryLog.Description>
      <HistoryLog.Summary>
        <HistoryLog.Icons>
          <Icon icon={iconAchievementChange as IconType} />
          <Icon icon={iconTier as IconType} />
        </HistoryLog.Icons>
        <GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
      </HistoryLog.Summary>
    </HistoryLog>
  );
};
