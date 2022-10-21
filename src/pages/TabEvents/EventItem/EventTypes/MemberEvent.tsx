import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	EventMemberJoin,
	EventMemberLeave,
	Member,
} from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import logo from 'shared/images/logo.ico';
import { MemberAvatar } from 'containers';
import { Size } from 'utils';

import { BaseEvent } from './BaseEvent';

type Props = {
	event: EventMemberJoin | EventMemberLeave;
	action: 'join' | 'leave';
};

export const MemberEvent = (props: Props): JSX.Element | null => {
	const { event, action } = props;
	const history = useHistory();

	const { membersData } = useAllMembers();
	const member = membersData.find((m: Member) => m.steamId === event.memberId);

	const onUserClick = () =>
		member?.steamId && history.push(`/profile/${member.steamId}`);

	return (
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} />
			{member ? (
				<BaseEvent.Description>
					<BaseEvent.Link className="bold" onClick={onUserClick}>
						{member?.name ?? `User ${event.memberId}`}
					</BaseEvent.Link>{' '}
					has {action === 'join' ? 'joined' : 'left'} the group!
				</BaseEvent.Description>
			) : (
				<BaseEvent.Description>
					<BaseEvent.Link className="bold" onClick={onUserClick}>
						{`User ${event.memberId}`}
					</BaseEvent.Link>{' '}
					has {action === 'join' ? 'joined' : 'left'} the group!
				</BaseEvent.Description>
			)}
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i
						className={
							member
								? action === 'join'
									? 'fas fa-user-plus'
									: 'fas fa-user-minus'
								: 'fas fa-exclamation-triangle'
						}></i>
				</BaseEvent.Icons>
				<BaseEvent.Image alt="game-img" src={logo} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
