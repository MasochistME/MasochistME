import React from 'react';
import { EventCustom, Member } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.png';
import { useMembers } from 'sdk';
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

	const { membersData } = useMembers();

	if (!content) {
		return null;
	}
	const { text, icon, memberId } = content;
	const memberData = membersData.find(
		(m: Member) => Number(m.steamId) === Number(memberId),
	);

	return (
		<EventInfo>
			<EventImg alt="avatar" src={memberData?.avatar ?? logo} />
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
