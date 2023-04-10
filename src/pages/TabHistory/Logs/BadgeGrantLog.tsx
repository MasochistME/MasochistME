import React from 'react';
import { useNavigate } from 'react-router';
import { LogBadgeGet, Badge, Member } from '@masochistme/sdk/dist/v1/types';

import { Icon } from 'components';
import { BadgeThumbnail, MemberAvatar } from 'containers';
import { useBadges, useAllMembers } from 'sdk';
import { Size } from 'components';

import { HistoryLog } from '.';

export const BadgeGrantLog = ({ log }: { log: LogBadgeGet }) => {
	const navigate = useNavigate();

	const { membersData } = useAllMembers();
	const { badgesData } = useBadges();

	const badge = badgesData.find((b: Badge) => String(b._id) === log.badgeId);
	const member = membersData.find((m: Member) => m.steamId === log.memberId);

	const onMemberClick = () => {
		if (member?.steamId) navigate(`/profile/${member.steamId}`);
	};

	if (!badge || !member) return null;

	return (
		<HistoryLog>
			<MemberAvatar member={member} size={Size.SMALL} />
			<HistoryLog.Description>
				<HistoryLog.Link onClick={onMemberClick}>
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
