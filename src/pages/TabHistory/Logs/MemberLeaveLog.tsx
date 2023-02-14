import React from 'react';
import { useHistory } from 'react-router';
import { LogMemberLeave, Member } from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import { Icon } from 'components';
import { MemberAvatar } from 'containers';
import { Size } from 'components';

import { HistoryLog } from '.';

type Props = {
	log: LogMemberLeave;
};

export const MemberLeaveLog = (props: Props): JSX.Element | null => {
	const { log } = props;
	const history = useHistory();

	const { membersData } = useAllMembers();
	const member = membersData.find((m: Member) => m.steamId === log.memberId);

	const onMemberClick = () => {
		if (member?.steamId) history.push(`/profile/${member.steamId}`);
	};

	return (
		<HistoryLog>
			<MemberAvatar member={member} size={Size.SMALL} />
			<HistoryLog.Description>
				<HistoryLog.Link onClick={onMemberClick}>
					{member?.name ?? `User ${log.memberId}`}
				</HistoryLog.Link>
				has left the group!
			</HistoryLog.Description>
			<HistoryLog.Summary>
				<HistoryLog.Icons>
					<Icon icon={member ? 'UserMinus' : 'WarningTriangle'} />
				</HistoryLog.Icons>
				<HistoryLog.Logo />
			</HistoryLog.Summary>
		</HistoryLog>
	);
};
