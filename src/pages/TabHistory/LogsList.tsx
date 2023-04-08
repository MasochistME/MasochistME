import React from 'react';
import styled from 'styled-components';
import {
	Log,
	LogAchievementNumberChange,
	LogBadgeCreate,
	LogBadgeGet,
	LogComplete,
	LogCustom,
	LogGameAdd,
	LogGameRemove,
	LogGameTierChange,
	LogMemberJoin,
	LogMemberLeave,
	LogType,
} from '@masochistme/sdk/dist/v1/types';

import { useAppContext } from 'context';
import { useLogs } from 'sdk';
import {
	DateBlock,
	Flex,
	QueryBoundary,
	ErrorFallback,
	Skeleton,
} from 'components';

import { HistoryLog } from './Logs';
import { useTheme, ColorTokens } from 'styles';

const NUMBER_OF_LOGS = 50;

export const LogsList = () => {
	return (
		<StyledLogList>
			<QueryBoundary
				fallback={<LogListSkeleton />}
				errorFallback={<ErrorFallback />}>
				<LogsListBoundary />
			</QueryBoundary>
		</StyledLogList>
	);
};

const LogsListBoundary = () => {
	const { visibleLogs } = useAppContext();
	const { colorTokens } = useTheme();
	const { data: logs = [] } = useLogs({
		sort: { date: 'desc' },
		// @ts-ignore
		filter: { type: { $in: visibleLogs } },
		limit: NUMBER_OF_LOGS,
	});

	const identifyLog = (log: Log): JSX.Element | null => {
		const type: LogType = log.type;

		switch (type) {
			case LogType.GAME_ADD:
				return <HistoryLog.GameAdd log={log as LogGameAdd} />;
			case LogType.GAME_REMOVE:
				return <HistoryLog.GameRemove log={log as LogGameRemove} />;
			case LogType.MEMBER_JOIN:
				return <HistoryLog.MemberJoin log={log as LogMemberJoin} />;
			case LogType.MEMBER_LEAVE:
				return <HistoryLog.MemberLeave log={log as LogMemberLeave} />;
			case LogType.COMPLETE:
				return <HistoryLog.GameComplete log={log as LogComplete} />;
			case LogType.GAME_TIER_CHANGE:
				return <HistoryLog.TierChange log={log as LogGameTierChange} />;
			case LogType.BADGE_CREATE:
				return <HistoryLog.BadgeCreate log={log as LogBadgeCreate} />;
			case LogType.BADGE_GET:
				return <HistoryLog.BadgeGrant log={log as LogBadgeGet} />;
			case LogType.ACHIEVEMENTS_CHANGE:
				return (
					<HistoryLog.AchievementNumberChange
						log={log as LogAchievementNumberChange}
					/>
				);
			case LogType.CUSTOM:
				return <HistoryLog.Custom log={log as LogCustom} />;
			default:
				return null;
		}
	};

	return (
		<>
			{logs.map((log: Log) => (
				<StyledLogItem
					align
					colorTokens={colorTokens}
					key={`log-${String(log._id)}`}>
					<DateBlock date={log.date} />
					{identifyLog(log)}
				</StyledLogItem>
			))}
		</>
	);
};

const LogListSkeleton = () => (
	<>
		{new Array(NUMBER_OF_LOGS).fill(null).map((_, i: number) => (
			<Skeleton
				key={`log-new-${i}`}
				height={42}
				width="100%"
				style={{ marginBottom: '0.2rem' }}
			/>
		))}
	</>
);

const StyledLogList = styled(Flex)`
	flex-direction: column;
	max-width: 100rem;
	width: 100%;
`;

const StyledLogItem = styled(Flex)<{ colorTokens: ColorTokens }>`
	justify-content: space-between;
	width: 100%;
	padding: var(--size-4);
	border-bottom: var(--size-1) solid
		${({ colorTokens }) => colorTokens['core-primary-bg']};
	border-top: var(--size-1) solid
		${({ colorTokens }) => colorTokens['semantic-color--disabled']}66;
	&:first-child {
		border-top: none;
	}
	&:last-child {
		border-bottom: none;
	}
`;
