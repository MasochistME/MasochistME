import {
  Game,
  LogComplete,
  Member,
  Tier,
} from '@masochistme/sdk/dist/v1/types';
import { Icon, IconType, Size } from 'components';
import { GameThumbnail, MemberAvatar } from 'containers';
import { useAllGames, useAllMembers, useTiers } from 'sdk';
import { HistoryLog } from '.';

type Props = {
  log: LogComplete;
};

export const GameCompleteLog = (props: Props): JSX.Element | null => {
  const { log } = props;

  const { membersData } = useAllMembers();
  const { tiersData } = useTiers();
  const { gamesData } = useAllGames();

  const member = membersData.find((m: Member) => m.steamId === log.memberId);
  const game = gamesData.find((g: Game) => g.id === log.gameId);
  const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);

  const iconMemberComplete = member ? 'SquareCheck' : 'WarningTriangle';
  const iconGameRating = (gameRating?.icon ?? 'QuestionCircle') as IconType;

  return (
    <HistoryLog>
      <MemberAvatar member={member} size={Size.SMALL} />
      <HistoryLog.Description>
        <HistoryLog.Link to={`/profile/${member?.steamId ?? 'NO_ID'}`}>
          {member?.name ?? `User ${log.memberId}`}
        </HistoryLog.Link>
        <span>completed</span>
        <HistoryLog.Link to={`/game/${game?.id ?? 'NO_ID'}`}>
          {game?.title ?? `game ${log.gameId}`}!
        </HistoryLog.Link>
      </HistoryLog.Description>
      <HistoryLog.Summary>
        <HistoryLog.Icons>
          <Icon icon={iconMemberComplete} />
          <Icon icon={iconGameRating} />
        </HistoryLog.Icons>
        <GameThumbnail game={game} size={Size.SMALL} />
      </HistoryLog.Summary>
    </HistoryLog>
  );
};
