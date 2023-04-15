import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import {
	Badge,
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
	Game,
	Member,
} from '@masochistme/sdk/dist/v1/types';

import { useBadges, useLogs, useTiers, useAllMembers, useAllGames } from 'sdk';
import { media } from 'styles';
import { getTierIcon } from 'utils';
import { LogDictionary } from 'configuration';
import { Section, SectionProps } from 'containers';
import {
	Flex,
	Icon,
	IconType,
	Skeleton,
	Size,
	QueryBoundary,
	ErrorFallback,
} from 'components';

import { LogCompact } from './components';

const NUMBER_OF_LOGS = 15;

type Props = Omit<SectionProps, 'content' | 'title'>;
export const DashboardTileHistory = (props: Props) => {
	const logs = new Array(NUMBER_OF_LOGS)
		.fill(null)
		.map((_, i: number) => (
			<Skeleton key={`logs-new-${i}`} height={22} width="100%" />
		));

	return (
		<QueryBoundary
			fallback={<Content content={logs} />}
			errorFallback={<Content content={<ErrorFallback />} />}>
			<DashboardTileHistoryBoundary {...props} />
		</QueryBoundary>
	);
};

export const DashboardTileHistoryBoundary = (props: Props) => {
	const { data: logs = [] } = useLogs({
		sort: { date: 'desc' },
		limit: NUMBER_OF_LOGS,
	});
	const {
		getLogMemberJoin,
		getLogMemberLeave,
		getLogGameAdd,
		getLogGameRemove,
		getLogComplete,
		getLogGameTierChange,
		getLogBadgeCreate,
		getLogBadgeGiven,
		getLogGameAchievementNumberChange,
		getLogCustom,
	} = useLogComponents();

	const classifyLogs = (log: Log) => {
		const type: LogType = log.type;

		switch (type) {
			case LogType.MEMBER_JOIN: {
				return getLogMemberJoin(log as LogMemberJoin);
			}
			case LogType.MEMBER_LEAVE: {
				return getLogMemberLeave(log as LogMemberLeave);
			}
			case LogType.GAME_ADD: {
				return getLogGameAdd(log as LogGameAdd);
			}
			case LogType.GAME_REMOVE: {
				return getLogGameRemove(log as LogGameRemove);
			}
			case LogType.COMPLETE: {
				return getLogComplete(log as LogComplete);
			}
			case LogType.GAME_TIER_CHANGE: {
				return getLogGameTierChange(log as LogGameTierChange);
			}
			case LogType.BADGE_CREATE: {
				return getLogBadgeCreate(log as LogBadgeCreate);
			}
			case LogType.BADGE_GET: {
				return getLogBadgeGiven(log as LogBadgeGet);
			}
			case LogType.ACHIEVEMENTS_CHANGE: {
				return getLogGameAchievementNumberChange(
					log as LogAchievementNumberChange,
				);
			}
			case LogType.CUSTOM: {
				return getLogCustom(log as LogCustom);
			}
			default:
				return null;
		}
	};

	return (
		<Content content={logs.map((log: Log) => classifyLogs(log))} {...props} />
	);
};

type ContentProps = Props & { content: React.ReactNode };
const Content = ({ content, ...props }: ContentProps) => (
	<Section
		width="100%"
		maxWidth="45rem"
		title="History"
		content={<StyledSectionHistory>{content}</StyledSectionHistory>}
		{...props}
	/>
);

const StyledSectionHistory = styled(Flex)`
	flex-direction: column;
	gap: var(--size-11);
	@media (max-width: ${media.smallNetbooks}) {
		gap: var(--size-4);
	}
`;

const useLogComponents = () => {
	const navigate = useNavigate();

	const { gamesData: games } = useAllGames();
	const { membersData: members } = useAllMembers();
	const { badgesData: badges } = useBadges();
	const { tiersData } = useTiers();

	const getLogMemberJoin = (log: LogMemberJoin) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.MEMBER_JOIN)?.icon ??
			'QuestionCircle';
		const member = members.find((m: Member) => m.steamId === log.memberId);
		const onUserClick = () =>
			member?.steamId && navigate(`/profile/${member.steamId}`);

		if (member)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link onClick={onUserClick}>
							{member.name}
						</LogCompact.Link>
						<span>has joined the group!</span>
					</LogCompact.Block>
				</LogCompact>
			);
	};

	const getLogMemberLeave = (log: LogMemberLeave) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.MEMBER_LEAVE)?.icon ??
			'QuestionCircle';
		const member = members.find((m: Member) => m.steamId === log.memberId);
		const onUserClick = () =>
			member?.steamId && navigate(`/profile/${member.steamId}`);

		if (member)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link onClick={onUserClick}>
							{member.name}
						</LogCompact.Link>
						<span>has left the group!</span>
					</LogCompact.Block>
				</LogCompact>
			);
	};

	const getLogGameAdd = (log: LogGameAdd) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.GAME_ADD)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === log.gameId);
		const onGameClick = () => game?.id && navigate(`/game/${game.id}`);

		if (game)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link onClick={onGameClick}>
							{game.title}
						</LogCompact.Link>
						<span>has been curated!</span>
					</LogCompact.Block>
				</LogCompact>
			);
	};

	const getLogGameRemove = (log: LogGameRemove) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.GAME_REMOVE)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === log.gameId);

		if (game)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link> {game.title}</LogCompact.Link>
						<span>has been removed from curator!</span>
					</LogCompact.Block>
				</LogCompact>
			);
	};

	const getLogComplete = (log: LogComplete) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.COMPLETE)?.icon ??
			'QuestionCircle';
		const member = members.find((m: Member) => m.steamId === log.memberId);
		const game = games.find((g: Game) => g.id === log.gameId);

		const onUserClick = () =>
			member?.steamId && navigate(`/profile/${member.steamId}`);
		const onGameClick = () => game?.id && navigate(`/game/${game.id}`);

		if (member && game)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link onClick={onUserClick}>
							{member.name}
						</LogCompact.Link>
						<span>completed</span>
						<LogCompact.Link onClick={onGameClick}>
							{game.title}!
						</LogCompact.Link>
					</LogCompact.Block>
				</LogCompact>
			);
	};

	const getLogGameTierChange = (log: LogGameTierChange) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.GAME_TIER_CHANGE)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === log.gameId);

		const onGameClick = () => game?.id && navigate(`/game/${game.id}`);

		if (game)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link onClick={onGameClick}>
							{game.title}
						</LogCompact.Link>
						<span>changed its tier to</span>
					</LogCompact.Block>
					<Icon size={Size.TINY} icon={getTierIcon(game.tier, tiersData)} />!
				</LogCompact>
			);
	};

	const getLogBadgeCreate = (log: LogBadgeCreate) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.BADGE_CREATE)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === Number(log.gameId));
		const badge = badges.find((b: Badge) => String(b._id) === log.badgeId);

		const onGameClick = () => game?.id && navigate(`/game/${game.id}`);

		if (game && badge)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link onClick={onGameClick}>
							{game.title}
						</LogCompact.Link>
						<span>got a new badge!</span>
					</LogCompact.Block>
				</LogCompact>
			);
	};

	const getLogBadgeGiven = (log: LogBadgeGet) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.BADGE_GET)?.icon ??
			'QuestionCircle';
		const badge = badges.find((b: Badge) => String(b._id) === log.badgeId);
		const member = members.find((m: Member) => m.steamId === log.memberId);

		const onUserClick = () =>
			member?.steamId && navigate(`/profile/${member.steamId}`);

		if (member && badge)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link onClick={onUserClick}>
							{member.name}
						</LogCompact.Link>
						<span>got a new badge - {badge.name}!</span>
					</LogCompact.Block>
				</LogCompact>
			);
	};

	const getLogGameAchievementNumberChange = (
		log: LogAchievementNumberChange,
	) => {
		const icon =
			LogDictionary.find(e => e.type === LogType.ACHIEVEMENTS_CHANGE)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === log.gameId);
		const onGameClick = () => game?.id && navigate(`/game/${game.id}`);

		if (game)
			return (
				<LogCompact key={`sidebar-log-${log._id}`}>
					<LogCompact.Icon icon={icon} />
					<LogCompact.Block>
						<LogCompact.Link onClick={onGameClick}>
							{game.title}
						</LogCompact.Link>
						<span>
							{log.oldNumber < log.newNumber
								? `got ${log.newNumber - log.oldNumber} new achievements!`
								: `had ${log.oldNumber - log.newNumber} achievements removed!`}
						</span>
					</LogCompact.Block>
				</LogCompact>
			);
	};

	const getLogCustom = (log: LogCustom) => {
		const { content } = log;
		if (!content) {
			return null;
		}
		const { text, icon: contentIcon } = content;
		if (!text) {
			return null;
		}
		const icon =
			(contentIcon as IconType) ??
			LogDictionary.find(e => e.type === LogType.CUSTOM)?.icon ??
			'QuestionCircle';

		return (
			<LogCompact key={`sidebar-log-${log._id}`}>
				<LogCompact.Icon icon={icon} />
				{/**TODO this icon type does not match */}
				<span>
					{text &&
						text.split('#').map((str: string, index: number) => {
							if (index % 2 === 1) {
								return <span>{str}</span>;
							}
							return str;
						})}
				</span>
			</LogCompact>
		);
	};

	return {
		getLogMemberJoin,
		getLogMemberLeave,
		getLogGameAdd,
		getLogGameRemove,
		getLogComplete,
		getLogGameTierChange,
		getLogBadgeCreate,
		getLogBadgeGiven,
		getLogGameAchievementNumberChange,
		getLogCustom,
	};
};
