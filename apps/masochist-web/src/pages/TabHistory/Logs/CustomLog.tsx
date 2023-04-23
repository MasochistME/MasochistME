import React from 'react';
import ReactMarkdown from 'react-markdown';
import { LogCustom, Member } from '@masochistme/sdk/dist/v1/types';

import { useAllMembers } from 'sdk';
import { useTheme } from 'styles';
import { Icon, IconType } from 'components';
import { MemberAvatar } from 'containers';
import { Size } from 'components';

import { HistoryLog } from '.';

type Props = {
	log: LogCustom;
};

export const CustomLog = (props: Props): JSX.Element | null => {
	const { LOGO_URL_STATIC } = useTheme();
	const { log } = props;
	const { text = null, icon = 'BirthdayCake', memberId = null } = log.content;

	const { membersData } = useAllMembers();

	const member = membersData.find(
		(m: Member) => Number(m.steamId) === Number(memberId),
	);

	if (!log.content) return null;

	return (
		<HistoryLog>
			<MemberAvatar member={member} size={Size.SMALL} />
			<HistoryLog.Description>
				{text && <ReactMarkdown>{text}</ReactMarkdown>}
			</HistoryLog.Description>
			<HistoryLog.Summary>
				<HistoryLog.Icons>
					<Icon icon={icon as IconType} />{' '}
					{/** TODO incompatible icon types possible */}
				</HistoryLog.Icons>
				<HistoryLog.Image alt="custom-img" src={LOGO_URL_STATIC} />
			</HistoryLog.Summary>
		</HistoryLog>
	);
};
