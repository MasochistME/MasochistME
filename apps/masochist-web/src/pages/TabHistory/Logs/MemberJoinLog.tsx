import { LogMemberJoin, Member } from '@masochistme/sdk/dist/v1/types';
import { Icon, Size } from 'components';
import { MemberAvatar } from 'containers';
import { useNavigate } from 'react-router';
import { useAllMembers } from 'sdk';
import { HistoryLog } from '.';

type Props = {
  log: LogMemberJoin;
};

export const MemberJoinLog = (props: Props): JSX.Element | null => {
  const { log } = props;
  const navigate = useNavigate();

  const { membersData } = useAllMembers();
  const member = membersData.find((m: Member) => m.steamId === log.memberId);

  const onMemberClick = () => {
    member?.steamId && navigate(`/profile/${member.steamId}`);
  };

  return (
    <HistoryLog>
      <MemberAvatar member={member} size={Size.SMALL} />
      <HistoryLog.Description>
        <HistoryLog.Link onClick={onMemberClick}>
          {member?.name ?? `User ${log.memberId}`}
        </HistoryLog.Link>
        has joined the group!
      </HistoryLog.Description>
      <HistoryLog.Summary>
        <HistoryLog.Icons>
          <Icon icon={member ? 'UserPlus' : 'WarningTriangle'} />
        </HistoryLog.Icons>
        <HistoryLog.Logo />
      </HistoryLog.Summary>
    </HistoryLog>
  );
};
