import { Game, LogGameTierChange, Tier } from '@masochistme/sdk/dist/v1/types';
import { Icon, IconType, Size } from 'components';
import { GameThumbnail } from 'containers';
import { useNavigate } from 'react-router';
import { useAllGames, useTiers } from 'sdk';
import { getTierIcon } from 'utils';
import { HistoryLog } from '.';

type Props = { log: LogGameTierChange };

export const TierChangeLog = (props: Props): JSX.Element | null => {
  const { log } = props;
  const navigate = useNavigate();

  const { tiersData } = useTiers();
  const { gamesData } = useAllGames();

  const game = gamesData.find((g: Game) => g.id === log.gameId);
  const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
  const isDemoted = Number(log.oldTier) > Number(log.newTier);

  const onGameClick = () => game?.id && navigate(`/game/${game.id}`);

  if (!game) return null;

  return (
    <HistoryLog>
      <HistoryLog.Logo />
      <HistoryLog.Description>
        <HistoryLog.Link onClick={onGameClick}>
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
        <GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
      </HistoryLog.Summary>
    </HistoryLog>
  );
};
