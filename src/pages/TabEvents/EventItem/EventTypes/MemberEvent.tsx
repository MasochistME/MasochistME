import React from 'react';
import { useHistory } from 'react-router-dom';
import {
	EventMemberJoin,
	EventMemberLeave,
} from '@masochistme/sdk/dist/v1/types';

import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
	EventLink,
} from 'pages/TabEvents/styles';
import { useUsers } from 'shared/hooks';
import logo from 'shared/images/logo.png';

type Props = {
	event: EventMemberJoin | EventMemberLeave;
	action: 'join' | 'leave';
};

export default function MemberEvent(props: Props): JSX.Element | null {
	const { event, action } = props;
	const history = useHistory();
	const users = useUsers(false);
	const user = users.find((u: any) => u.id === event.memberId);

	const onUserClick = () => user?.id && history.push(`/profile/${user.id}`);

	return (
		<EventInfo>
			<EventImg alt="avatar" src={user?.avatar ?? logo} />
			{user ? (
				<EventDescription>
					<EventLink className="bold" onClick={onUserClick}>
						{user?.name ?? `User ${event.memberId}`}
					</EventLink>{' '}
					has {action === 'join' ? 'joined' : 'left'} the group!
				</EventDescription>
			) : (
				<EventDescription>
					<EventLink className="bold" onClick={onUserClick}>
						{user?.name ?? `User ${event.memberId}`}
					</EventLink>{' '}
					has {action === 'join' ? 'joined' : 'left'} the group!
				</EventDescription>
			)}
			<EventSummary>
				<i
					className={
						user
							? action === 'join'
								? 'fas fa-user-plus'
								: 'fas fa-user-minus'
							: 'fas fa-exclamation-triangle'
					}></i>
				<EventImg alt="game-img" src={logo} />
			</EventSummary>
		</EventInfo>
	);
}
