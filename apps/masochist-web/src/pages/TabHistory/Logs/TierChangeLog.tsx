import { Game, LogGameTierChange, Tier } from '@masochistme/sdk/dist/v1/types';
import { GameThumbnail } from 'containers';
import { useAllGames, useTiers } from 'sdk';
import { getTierIcon } from 'utils';
import { HistoryLog } from '.';
import { IconType, Size } from '../../../components';
import { Icon } from './components';

type Props = { log: LogGameTierChange };

export const TierChangeLog = (props: Props): JSX.Element | null => {
  const { log } = props;

  const { tiersData } = useTiers();
  const { gamesData } = useAllGames();

  const game = gamesData.find((g: Game) => g.id === log.gameId);
  const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
  const isDemoted = Number(log.oldTier) > Number(log.newTier);

  const to = `/game/${game?.id ?? 'NO_ID'}`;

  if (!game) return null;

  return (
    <HistoryLog>
      <HistoryLog.Logo />
      <HistoryLog.Description>
        <HistoryLog.Link to={to}>
          {game?.title ?? `Game ${log.gameId}`}
        </HistoryLog.Link>
        <span>
          has been
          {isDemoted ? ' demoted ' : ' promoted '}
          from
        </span>
        <HistoryLog.Icon icon={getTierIcon(log.oldTier, tiersData)} />
        <span>to</span>
        <HistoryLog.Icon icon={getTierIcon(log.newTier, tiersData)} />
        <span>!</span>
      </HistoryLog.Description>
      <HistoryLog.Summary>
        <HistoryLog.Icons>
          <Icon icon={isDemoted ? 'AnglesDown' : 'AnglesUp'} />
          <Icon
            icon={gameRating ? (gameRating.icon as IconType) : 'QuestionCircle'}
          />
        </HistoryLog.Icons>
        <GameThumbnail game={game} size={Size.SMALL} />
      </HistoryLog.Summary>
    </HistoryLog>
  );
};
