import React from 'react';
import { useHistory } from 'react-router';
import { EventMemberLeave, Member } from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import { Icon } from 'components';
import { MemberAvatar } from 'containers';
import { Size } from 'components';

import { BaseEvent } from './_BaseEvent';

type Props = {
	event: EventMemberLeave;
};

export const MemberLeaveEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { membersData } = useAllMembers();
	const member = membersData.find((m: Member) => m.steamId === event.memberId);

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
					<Icon icon={member ? 'UserMinus' : 'WarningTriangle'} />
				</BaseEvent.Icons>
				<BaseEvent.Logo />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
