import React from 'react';
import { useHistory } from 'react-router';
import { EventBadgeGet, Badge, Member } from '@masochistme/sdk/dist/v1/types';

import { Icon } from 'components';
import { BadgeThumbnail, MemberAvatar } from 'containers';
import { useBadges, useAllMembers } from 'sdk';
import { Size } from 'components';

import { BaseEvent } from './_BaseEvent';

export const BadgeGrantEvent = ({ event }: { event: EventBadgeGet }) => {
	const history = useHistory();

	const { membersData } = useAllMembers();
	const { badgesData } = useBadges();

	const badge = badgesData.find((b: Badge) => String(b._id) === event.badgeId);
	const member = membersData.find((m: Member) => m.steamId === event.memberId);

	const onMemberClick = () => {
		if (member?.steamId) history.push(`/profile/${member.steamId}`);
	};

	if (!badge || !member) return null;

	return (
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onMemberClick}>
					{member?.name ?? `User ${event.memberId}`}
				</BaseEvent.Link>
				has earned a new badge -
				<BaseEvent.Link> {badge?.name ?? event.badgeId}!</BaseEvent.Link>
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<Icon icon={member ? 'SquareCheck' : 'WarningTriangle'} />
					<Icon icon="Badge" />
				</BaseEvent.Icons>
				<BadgeThumbnail badge={badge} size={Size.SMALL} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
