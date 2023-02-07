import React from 'react';
import ReactMarkdown from 'react-markdown';
import { EventCustom, Member } from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import { useTheme } from 'styles';
import { Icon, IconType } from 'components';
import { MemberAvatar } from 'containers';
import { Size } from 'components';

import { BaseEvent } from './_BaseEvent';

type Props = {
	event: EventCustom;
};

export const CustomEvent = (props: Props): JSX.Element | null => {
	const { LOGO_URL_STATIC } = useTheme();
	const { event } = props;
	const { text = null, icon = 'BirthdayCake', memberId = null } = event.content;

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
					<Icon icon={icon as IconType} />{' '}
					{/** TODO incompatible icon types possible */}
				</BaseEvent.Icons>
				<BaseEvent.Image alt="custom-img" src={LOGO_URL_STATIC} />
			</BaseEvent.Summary>
		</BaseEvent>
	);
};
