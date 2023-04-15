import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { LogMemberJoin, LogType } from '@masochistme/sdk/dist/v1/types';

import { media } from 'styles';
import { useCuratorMembers, useLogs } from 'sdk';
import { MemberAvatar, Section, SectionProps } from 'containers';
import { Flex, ErrorFallback, QueryBoundary } from 'components';
import { Size } from 'components';

const NUMBER_OF_MEMBERS = 10;

type Props = Omit<SectionProps, 'content' | 'title'>;
export const DashboardTileMembers = (props: Props) => {
	const members = new Array(NUMBER_OF_MEMBERS)
		.fill(null)
		.map((_, i: number) => (
			<MemberAvatar isLoading key={`member-new-${i}`} size={Size.BIG} />
		));

	return (
		<QueryBoundary
			fallback={<Content content={members} />}
			errorFallback={
				<Content content={<ErrorFallback width="45rem" maxWidth="100%" />} />
			}>
			<DashboardTileMembersBoundary {...props} />
		</QueryBoundary>
	);
};

const DashboardTileMembersBoundary = (props: Props) => {
	const navigate = useNavigate();
	const { membersData } = useCuratorMembers();
	const { data: logs = [] } = useLogs({
		limit: NUMBER_OF_MEMBERS,
		sort: { date: 'desc' },
		filter: { type: LogType.MEMBER_JOIN },
	});

	const onMemberClick = (memberId?: string) => {
		if (memberId) navigate(`/profile/${memberId}`);
	};

	const memberLogs = logs.filter(
		log => log.type === LogType.MEMBER_JOIN,
	) as unknown as LogMemberJoin[];

	const members = memberLogs.map(log => {
		const member = membersData.find(member => member.steamId === log.memberId);
		if (member)
			return (
				<MemberAvatar
					key={`new-member-${member.steamId}`}
					member={member}
					size={Size.BIG}
					onClick={() => onMemberClick(member.steamId)}
					title={
						<Flex column>
							<span style={{ fontWeight: 'bold' }}>{member.name}</span>
							<span>Joined {dayjs(log.date).fromNow()}</span>
						</Flex>
					}
				/>
			);
	});

	return <Content content={members} {...props} />;
};

type ContentProps = Props & { content: React.ReactNode };
const Content = ({ content, ...props }: ContentProps) => (
	<Section
		width="100%"
		maxWidth="45rem"
		title="New members"
		content={<StyledNewMembers>{content}</StyledNewMembers>}
		{...props}
	/>
);

const StyledNewMembers = styled(Flex)`
	justify-content: center;
	gap: var(--size-16);
	flex-wrap: wrap;
	@media (max-width: ${media.smallNetbooks}) {
		gap: var(--size-4);
	}
	@media (max-width: ${media.bigPhones}) {
		display: flex;
	}
`;
