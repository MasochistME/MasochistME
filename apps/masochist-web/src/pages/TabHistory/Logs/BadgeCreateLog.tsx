import { Badge, Game, LogBadgeCreate } from '@masochistme/sdk/dist/v1/types';
import { Icon, Size } from 'components';
import { BadgeThumbnail, GameThumbnail } from 'containers';
import { useBadges, useCuratedGames } from 'sdk';
import { HistoryLog } from '.';

export const BadgeCreateLog = ({ log }: { log: LogBadgeCreate }) => {
  const { gamesData } = useCuratedGames();
  const { badgesData } = useBadges();

  const badge = badgesData.find((b: Badge) => String(b._id) === log.badgeId);
  const game = gamesData.find((g: Game) => g.id === log.gameId);

  const to = `/game/${game?.id ?? 'NO_ID'}`;

  if (!badge || !game) return null;
  return (
    <HistoryLog>
      <BadgeThumbnail size={Size.SMALL} badge={badge} />
      <HistoryLog.Description>
        <HistoryLog.Link to={to}>
          {game?.title ?? `Game ${log.gameId}`}
        </HistoryLog.Link>
        has gotten a new badge -
        <HistoryLog.Link to={to}>
          {' '}
          {badge?.name ?? log.badgeId}!
        </HistoryLog.Link>
      </HistoryLog.Description>
      <HistoryLog.Summary>
        <HistoryLog.Icons>
          <Icon icon="Badge" />
        </HistoryLog.Icons>
        <GameThumbnail game={game} size={Size.SMALL} />
      </HistoryLog.Summary>
    </HistoryLog>
  );
};
