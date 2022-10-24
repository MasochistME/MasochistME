import React from 'react';
import { useHistory } from 'react-router-dom';
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
import { media } from 'shared/theme';
import { getTierIcon } from 'utils';
import { SmallEvent, Section, SectionProps, EventLink } from 'containers';
import { Flex, Skeleton } from 'components';

const NUMBER_OF_EVENTS = 13;

export const DashboardTileHistory = (
	props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
	const { eventsData, isLoading, isFetched } = useEvents({
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

	const loadingEvents = new Array(NUMBER_OF_EVENTS)
		.fill(null)
		.map((_, i: number) => (
			<Skeleton key={`badge-new-${i}`} height={22} width="100%" />
		));

	return (
		<Section
			width="100%"
			maxWidth="450px"
			title="Last events"
			content={
				<StyledSectionHistory>
					{isLoading && loadingEvents}
					{isFetched && eventsData.map((event: Event) => classifyEvents(event))}
				</StyledSectionHistory>
			}
			{...props}
		/>
	);
};

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
		const member = members.find((m: Member) => m.steamId === event.memberId);
		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);

		return (
			member && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-user-plus"></i>
					<EventLink onClick={onUserClick}> {member.name}</EventLink> has joined
					the group!
				</SmallEvent>
			)
		);
	};

	const getEventMemberLeave = (event: EventMemberLeave) => {
		const member = members.find((m: Member) => m.steamId === event.memberId);
		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);

		return (
			member && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-user-minus"></i>
					<EventLink onClick={onUserClick}> {member.name}</EventLink> has left
					the group!
				</SmallEvent>
			)
		);
	};

	const getEventGameAdd = (event: EventGameAdd) => {
		const game = games.find((g: Game) => g.id === event.gameId);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return (
			game && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-plus-square"></i>
					<EventLink onClick={onGameClick}> {game.title}</EventLink> has been
					curated!
				</SmallEvent>
			)
		);
	};

	const getEventGameRemove = (event: EventGameRemove) => {
		const game = games.find((g: Game) => g.id === event.gameId);

		return (
			game && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-minus-square"></i>
					<EventLink> {game.title}</EventLink> has been removed from curator!
				</SmallEvent>
			)
		);
	};

	const getEventComplete = (event: EventComplete) => {
		const member = members.find((m: Member) => m.steamId === event.memberId);
		const game = games.find((g: Game) => g.id === event.gameId);

		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return (
			member &&
			game && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-check-square"></i>
					<EventLink onClick={onUserClick}>
						{' '}
						{member.name}
					</EventLink> completed{' '}
					<EventLink onClick={onGameClick}>{game.title}</EventLink>!
				</SmallEvent>
			)
		);
	};

	const getEventGameTierChange = (event: EventGameTierChange) => {
		const game = games.find((g: Game) => g.id === event.gameId);

		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return (
			game && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-undo-alt"></i>
					<EventLink onClick={onGameClick}> {game.title}</EventLink> changed its
					tier to <i className={getTierIcon(game.tier, tiersData)} />!
				</SmallEvent>
			)
		);
	};

	const getEventBadgeCreate = (event: EventBadgeCreate) => {
		const game = games.find((g: Game) => g.id === Number(event.gameId));
		const badge = badges.find((b: Badge) => String(b._id) === event.badgeId);

		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return (
			badge &&
			game && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-award"></i>
					<EventLink onClick={onGameClick}> {game.title}</EventLink> got a new
					badge!
				</SmallEvent>
			)
		);
	};

	const getEventBadgeGiven = (event: EventBadgeGet) => {
		const badge = badges.find((b: Badge) => String(b._id) === event.badgeId);
		const member = members.find((m: Member) => m.steamId === event.memberId);

		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);

		return (
			member &&
			badge && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-medal"></i>
					<EventLink onClick={onUserClick}> {member.name} </EventLink> got a new
					badge - <span>{badge.name}</span>!
				</SmallEvent>
			)
		);
	};

	const getEventGameAchievementNumberChange = (
		event: EventAchievementNumberChange,
	) => {
		const game = games.find((g: Game) => g.id === event.gameId);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return (
			game && (
				<SmallEvent key={`sidebar-event-${event._id}`}>
					<i className="fas fa-tasks"></i>
					<EventLink onClick={onGameClick}> {game.title}</EventLink>{' '}
					{event.oldNumber < event.newNumber
						? `got ${event.newNumber - event.oldNumber} new achievements!`
						: `had ${event.oldNumber - event.newNumber} achievements removed!`}
				</SmallEvent>
			)
		);
	};

	const getEventCustom = (event: EventCustom) => {
		const { content } = event;
		if (!content) {
			return null;
		}
		const { text, icon } = content;
		if (!text) {
			return null;
		}

		return (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className={icon ? icon : 'fas fa-birthday-cake'}></i>{' '}
				{text &&
					text.split('#').map((str: string, index: number) => {
						if (index % 2 === 1) {
							return <span>{str}</span>;
						}
						return str;
					})}
			</SmallEvent>
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