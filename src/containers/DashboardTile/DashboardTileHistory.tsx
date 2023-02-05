import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import {
	Badge,
	Event,
	EventAchievementNumberChange,
	EventBadgeCreate,
	EventBadgeGet,
	EventComplete,
	EventCustom,
	EventGameAdd,
	EventGameRemove,
	EventGameTierChange,
	EventMemberJoin,
	EventMemberLeave,
	EventType,
	Game,
	Member,
} from '@masochistme/sdk/dist/v1/types';

import {
	useBadges,
	useEvents,
	useTiers,
	useAllMembers,
	useAllGames,
} from 'sdk';
import { media } from 'styles';
import { getTierIcon } from 'utils';
import { EventsDict } from 'configuration';
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

import { EventCompact } from './components';

const NUMBER_OF_EVENTS = 15;

type Props = Omit<SectionProps, 'content' | 'title'>;
export const DashboardTileHistory = (props: Props) => {
	const events = new Array(NUMBER_OF_EVENTS)
		.fill(null)
		.map((_, i: number) => (
			<Skeleton key={`event-new-${i}`} height={22} width="100%" />
		));

	return (
		<QueryBoundary
			fallback={<Content content={events} />}
			errorFallback={<Content content={<ErrorFallback />} />}>
			<DashboardTileHistoryBoundary {...props} />
		</QueryBoundary>
	);
};

export const DashboardTileHistoryBoundary = (props: Props) => {
	const { eventsData } = useEvents({
		sort: { date: 'desc' },
		limit: NUMBER_OF_EVENTS,
	});
	const {
		getEventMemberJoin,
		getEventMemberLeave,
		getEventGameAdd,
		getEventGameRemove,
		getEventComplete,
		getEventGameTierChange,
		getEventBadgeCreate,
		getEventBadgeGiven,
		getEventGameAchievementNumberChange,
		getEventCustom,
	} = useEventComponents();

	const classifyEvents = (event: Event) => {
		const type: EventType = event.type;

		switch (type) {
			case EventType.MEMBER_JOIN: {
				return getEventMemberJoin(event as EventMemberJoin);
			}
			case EventType.MEMBER_LEAVE: {
				return getEventMemberLeave(event as EventMemberLeave);
			}
			case EventType.GAME_ADD: {
				return getEventGameAdd(event as EventGameAdd);
			}
			case EventType.GAME_REMOVE: {
				return getEventGameRemove(event as EventGameRemove);
			}
			case EventType.COMPLETE: {
				return getEventComplete(event as EventComplete);
			}
			case EventType.GAME_TIER_CHANGE: {
				return getEventGameTierChange(event as EventGameTierChange);
			}
			case EventType.BADGE_CREATE: {
				return getEventBadgeCreate(event as EventBadgeCreate);
			}
			case EventType.BADGE_GET: {
				return getEventBadgeGiven(event as EventBadgeGet);
			}
			case EventType.ACHIEVEMENTS_CHANGE: {
				return getEventGameAchievementNumberChange(
					event as EventAchievementNumberChange,
				);
			}
			case EventType.CUSTOM: {
				return getEventCustom(event as EventCustom);
			}
			default:
				return null;
		}
	};

	return (
		<Content
			content={eventsData.map((event: Event) => classifyEvents(event))}
			{...props}
		/>
	);
};

type ContentProps = Props & { content: React.ReactNode };
const Content = ({ content, ...props }: ContentProps) => (
	<Section
		width="100%"
		maxWidth="450px"
		title="Last events"
		content={<StyledSectionHistory>{content}</StyledSectionHistory>}
		{...props}
	/>
);

const StyledSectionHistory = styled(Flex)`
	flex-direction: column;
	gap: 11px;
	@media (max-width: ${media.smallNetbooks}) {
		gap: 4px;
	}
`;

const useEventComponents = () => {
	const history = useHistory();

	const { gamesData: games } = useAllGames();
	const { membersData: members } = useAllMembers();
	const { badgesData: badges } = useBadges();
	const { tiersData } = useTiers();

	const getEventMemberJoin = (event: EventMemberJoin) => {
		const icon =
			EventsDict.find(e => e.type === EventType.MEMBER_JOIN)?.icon ??
			'QuestionCircle';
		const member = members.find((m: Member) => m.steamId === event.memberId);
		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);

		if (member)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link onClick={onUserClick}>
							{member.name}
						</EventCompact.Link>
						<span>has joined the group!</span>
					</EventCompact.Block>
				</EventCompact>
			);
	};

	const getEventMemberLeave = (event: EventMemberLeave) => {
		const icon =
			EventsDict.find(e => e.type === EventType.MEMBER_LEAVE)?.icon ??
			'QuestionCircle';
		const member = members.find((m: Member) => m.steamId === event.memberId);
		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);

		if (member)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link onClick={onUserClick}>
							{member.name}
						</EventCompact.Link>
						<span>has left the group!</span>
					</EventCompact.Block>
				</EventCompact>
			);
	};

	const getEventGameAdd = (event: EventGameAdd) => {
		const icon =
			EventsDict.find(e => e.type === EventType.GAME_ADD)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === event.gameId);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		if (game)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link onClick={onGameClick}>
							{game.title}
						</EventCompact.Link>
						<span>has been curated!</span>
					</EventCompact.Block>
				</EventCompact>
			);
	};

	const getEventGameRemove = (event: EventGameRemove) => {
		const icon =
			EventsDict.find(e => e.type === EventType.GAME_REMOVE)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === event.gameId);

		if (game)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link> {game.title}</EventCompact.Link>
						<span>has been removed from curator!</span>
					</EventCompact.Block>
				</EventCompact>
			);
	};

	const getEventComplete = (event: EventComplete) => {
		const icon =
			EventsDict.find(e => e.type === EventType.COMPLETE)?.icon ??
			'QuestionCircle';
		const member = members.find((m: Member) => m.steamId === event.memberId);
		const game = games.find((g: Game) => g.id === event.gameId);

		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		if (member && game)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link onClick={onUserClick}>
							{member.name}
						</EventCompact.Link>
						<span>completed</span>
						<EventCompact.Link onClick={onGameClick}>
							{game.title}!
						</EventCompact.Link>
					</EventCompact.Block>
				</EventCompact>
			);
	};

	const getEventGameTierChange = (event: EventGameTierChange) => {
		const icon =
			EventsDict.find(e => e.type === EventType.GAME_TIER_CHANGE)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === event.gameId);

		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		if (game)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link onClick={onGameClick}>
							{game.title}
						</EventCompact.Link>
						<span>changed its tier to</span>
					</EventCompact.Block>
					<Icon size={Size.TINY} icon={getTierIcon(game.tier, tiersData)} />!
				</EventCompact>
			);
	};

	const getEventBadgeCreate = (event: EventBadgeCreate) => {
		const icon =
			EventsDict.find(e => e.type === EventType.BADGE_CREATE)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === Number(event.gameId));
		const badge = badges.find((b: Badge) => String(b._id) === event.badgeId);

		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		if (game && badge)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link onClick={onGameClick}>
							{game.title}
						</EventCompact.Link>
						<span>got a new badge!</span>
					</EventCompact.Block>
				</EventCompact>
			);
	};

	const getEventBadgeGiven = (event: EventBadgeGet) => {
		const icon =
			EventsDict.find(e => e.type === EventType.BADGE_GET)?.icon ??
			'QuestionCircle';
		const badge = badges.find((b: Badge) => String(b._id) === event.badgeId);
		const member = members.find((m: Member) => m.steamId === event.memberId);

		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);

		if (member && badge)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link onClick={onUserClick}>
							{member.name}
						</EventCompact.Link>
						<span>got a new badge - {badge.name}!</span>
					</EventCompact.Block>
				</EventCompact>
			);
	};

	const getEventGameAchievementNumberChange = (
		event: EventAchievementNumberChange,
	) => {
		const icon =
			EventsDict.find(e => e.type === EventType.ACHIEVEMENTS_CHANGE)?.icon ??
			'QuestionCircle';
		const game = games.find((g: Game) => g.id === event.gameId);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		if (game)
			return (
				<EventCompact key={`sidebar-event-${event._id}`}>
					<EventCompact.Icon icon={icon} />
					<EventCompact.Block>
						<EventCompact.Link onClick={onGameClick}>
							{game.title}
						</EventCompact.Link>
						<span>
							{event.oldNumber < event.newNumber
								? `got ${event.newNumber - event.oldNumber} new achievements!`
								: `had ${
										event.oldNumber - event.newNumber
								  } achievements removed!`}
						</span>
					</EventCompact.Block>
				</EventCompact>
			);
	};

	const getEventCustom = (event: EventCustom) => {
		const { content } = event;
		if (!content) {
			return null;
		}
		const { text, icon: contentIcon } = content;
		if (!text) {
			return null;
		}
		const icon =
			(contentIcon as IconType) ??
			EventsDict.find(e => e.type === EventType.CUSTOM)?.icon ??
			'QuestionCircle';

		return (
			<EventCompact key={`sidebar-event-${event._id}`}>
				<EventCompact.Icon icon={icon} />
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
			</EventCompact>
		);
	};

	return {
		getEventMemberJoin,
		getEventMemberLeave,
		getEventGameAdd,
		getEventGameRemove,
		getEventComplete,
		getEventGameTierChange,
		getEventBadgeCreate,
		getEventBadgeGiven,
		getEventGameAchievementNumberChange,
		getEventCustom,
	};
};
