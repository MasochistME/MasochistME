import React from 'react';
import ReactMarkdown from 'react-markdown';
import { EventCustom, Member } from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import { useTheme } from 'styles';
import { MemberAvatar } from 'containers';
import { Size } from 'utils';

import { BaseEvent } from './_BaseEvent';

type Props = {
	event: EventCustom;
};

export const CustomEvent = (props: Props): JSX.Element | null => {
	const { LOGO_URL } = useTheme();
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
				<BaseEvent.Image alt="custom-img" src={LOGO_URL} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
