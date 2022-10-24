import React from 'react';
import { useHistory } from 'react-router-dom';
import { EventMemberLeave, Member } from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import { MemberAvatar } from 'containers';
import { Size } from 'utils';

import { BaseEvent } from './_BaseEvent';

type Props = {
	event: EventMemberLeave;
};

export const MemberLeaveEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { membersData } = useAllMembers();
	const member = membersData.find((m: Member) => m.steamId === event.memberId);

	const iconMemberLeave = member
		? 'fas fa-user-minus'
		: 'fas fa-exclamation-triangle';

	const onMemberClick = () => {
		if (member?.steamId) history.push(`/profile/${member.steamId}`);
	};

	return (
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onMemberClick}>
					{member?.name ?? `User ${event.memberId}`}
				</BaseEvent.Link>
				has left the group!
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i className={iconMemberLeave} />
				</BaseEvent.Icons>
				<BaseEvent.Logo />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
