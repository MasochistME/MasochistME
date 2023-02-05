import React from 'react';
import { useHistory } from 'react-router';
import { EventMemberJoin, Member } from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import { MemberAvatar } from 'containers';
import { Icon } from 'components';
import { Size } from 'components';

import { BaseEvent } from './_BaseEvent';

type Props = {
	event: EventMemberJoin;
};

export const MemberJoinEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const history = useHistory();

	const { membersData } = useAllMembers();
	const member = membersData.find((m: Member) => m.steamId === event.memberId);

	const onMemberClick = () => {
		member?.steamId && history.push(`/profile/${member.steamId}`);
	};

	return (
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} />
			<BaseEvent.Description>
				<BaseEvent.Link onClick={onMemberClick}>
					{member?.name ?? `User ${event.memberId}`}
				</BaseEvent.Link>
				has joined the group!
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<Icon icon={member ? 'UserPlus' : 'WarningTriangle'} />
				</BaseEvent.Icons>
				<BaseEvent.Logo />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
