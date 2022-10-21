import React from 'react';
import { EventCustom, Member } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { useAllMembers } from 'sdk';
import { MemberAvatar } from 'containers';
import { Size } from 'utils';

import { BaseEvent } from './BaseEvent';

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
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} />
			<BaseEvent.Description>
				{text &&
					text
						.split('#')
						.map((str: string, index: number) =>
							index % 2 === 1 ? <span className="bold">{str}</span> : str,
						)}
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i className={icon ? icon : 'fas fa-birthday-cake'}></i>
				</BaseEvent.Icons>
				<BaseEvent.Image alt="custom-img" src={logo} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
