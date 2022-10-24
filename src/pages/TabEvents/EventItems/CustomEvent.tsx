import React from 'react';
import { EventCustom, Member } from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import { MemberAvatar } from 'containers';
import { Size } from 'utils';

import { BaseEvent } from './_BaseEvent';
import ReactMarkdown from 'react-markdown';

type Props = {
	event: EventCustom;
};

const LOGO = 'http://cdn.masochist.me/mme_logo.png';

export const CustomEvent = (props: Props): JSX.Element | null => {
	const { event } = props;
	const { text = null, icon = null, memberId = null } = event.content;

	const { membersData } = useAllMembers();

	const member = membersData.find(
		(m: Member) => Number(m.steamId) === Number(memberId),
	);

	if (!event.content) return null;

	return (
		<BaseEvent>
			<MemberAvatar member={member} size={Size.SMALL} />
			<BaseEvent.Description>
				{text && <ReactMarkdown>{text}</ReactMarkdown>}
			</BaseEvent.Description>
			<BaseEvent.Summary>
				<BaseEvent.Icons>
					<i className={icon ? icon : 'fas fa-birthday-cake'}></i>
				</BaseEvent.Icons>
				<BaseEvent.Image alt="custom-img" src={LOGO} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
