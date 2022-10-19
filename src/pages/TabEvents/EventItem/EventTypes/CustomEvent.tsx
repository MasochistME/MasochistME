import React from 'react';
import { EventCustom, Member } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { useAllMembers } from 'sdk';
import { MemberAvatar } from 'containers';
import { Size } from 'utils';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
} from './components';

type TCustomEvent = {
	event: EventCustom;
};

export const CustomEvent = (props: TCustomEvent): JSX.Element | null => {
	const { event } = props;
	const content = event.content;

	const { membersData } = useAllMembers();

	if (!content) {
		return null;
	}
	const { text, icon, memberId } = content;
	const member = membersData.find(
		(m: Member) => Number(m.steamId) === Number(memberId),
	);

	return (
		<EventInfo>
			<MemberAvatar member={member} size={Size.SMALL} />
			{
				<EventDescription>
					{text &&
						text
							.split('#')
							.map((str: string, index: number) =>
								index % 2 === 1 ? <span className="bold">{str}</span> : str,
							)}
				</EventDescription>
			}
			<EventSummary>
				<i className={icon ? icon : 'fas fa-birthday-cake'}></i>
				<EventImg alt="custom-img" src={logo} />
			</EventSummary>
		</EventInfo>
	);
};
