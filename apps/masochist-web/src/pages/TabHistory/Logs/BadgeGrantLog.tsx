import { Badge, LogBadgeGet, Member } from '@masochistme/sdk/dist/v1/types';
import { Icon, Size } from 'components';
import { BadgeThumbnail, MemberAvatar } from 'containers';
import { useAllMembers, useBadges } from 'sdk';
import { HistoryLog } from '.';

export const BadgeGrantLog = ({ log }: { log: LogBadgeGet }) => {
  const { membersData } = useAllMembers();
  const { badgesData } = useBadges();

  const badge = badgesData.find((b: Badge) => String(b._id) === log.badgeId);
  const member = membersData.find((m: Member) => m.steamId === log.memberId);

  const to = `/profile/${member?.steamId ?? 'NO_ID'}`;

  if (!badge || !member) return null;

  return (
    <HistoryLog>
      <MemberAvatar member={member} size={Size.SMALL} />
      <HistoryLog.Description>
        <HistoryLog.Link to={to}>
          {member?.name ?? `User ${log.memberId}`}
        </HistoryLog.Link>
        has earned a new badge -
        <HistoryLog.Link> {badge?.name ?? log.badgeId}!</HistoryLog.Link>
      </HistoryLog.Description>
      <HistoryLog.Summary>
        <HistoryLog.Icons>
          <Icon icon={member ? 'SquareCheck' : 'WarningTriangle'} />
          <Icon icon="Badge" />
        </HistoryLog.Icons>
        <BadgeThumbnail badge={badge} size={Size.SMALL} />
      </HistoryLog.Summary>
    </HistoryLog>
  );
};
