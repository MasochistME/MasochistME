import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	EventMemberJoin,
	EventMemberLeave,
	Member,
} from '@masochistme/sdk/dist/v1/types';

import { useMembers } from 'sdk';
import logo from 'shared/images/logo.png';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from './components';

type Props = {
	event: EventMemberJoin | EventMemberLeave;
	action: 'join' | 'leave';
};

export const MemberEvent = (props: Props): JSX.Element | null => {
	const { event, action } = props;
	const history = useHistory();

	const { membersData } = useMembers();
	const member = membersData.find((m: Member) => m.steamId === event.memberId);

	const onUserClick = () =>
		member?.steamId && history.push(`/profile/${member.steamId}`);

	return (
		<EventInfo>
			<EventImg alt="avatar" src={member?.avatar ?? logo} />
			{member ? (
				<EventDescription>
					<EventLink className="bold" onClick={onUserClick}>
						{member?.name ?? `User ${event.memberId}`}
					</EventLink>{' '}
					has {action === 'join' ? 'joined' : 'left'} the group!
				</EventDescription>
			) : (
				<EventDescription>
					<EventLink className="bold" onClick={onUserClick}>
						{`User ${event.memberId}`}
					</EventLink>{' '}
					has {action === 'join' ? 'joined' : 'left'} the group!
				</EventDescription>
			)}
			<EventSummary>
				<i
					className={
						member
							? action === 'join'
								? 'fas fa-user-plus'
								: 'fas fa-user-minus'
							: 'fas fa-exclamation-triangle'
					}></i>
				<EventImg alt="game-img" src={logo} />
			</EventSummary>
		</EventInfo>
	);
};
