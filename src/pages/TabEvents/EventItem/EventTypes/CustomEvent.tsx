import React from 'react';
import { EventCustom } from '@masochistme/sdk/dist/v1/types';

import { useUsers } from 'shared/hooks';
import {
	EventDescription,
	EventSummary,
	EventInfo,
	EventImg,
} from 'pages/TabEvents/styles';
import logo from 'shared/images/logo.png';

type TCustomEvent = {
	event: EventCustom;
};

export default function CustomEvent(props: TCustomEvent): JSX.Element | null {
	const { event } = props;
	const content = event.content;

	const users = useUsers(false);

	if (!content) {
		return null;
	}
	const { text, icon, memberId } = content;
	const userData = users.find((m: any) => Number(m.id) === Number(memberId));

	return (
		<EventInfo>
			<EventImg alt="avatar" src={userData ? userData.avatar : logo} />
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
}
