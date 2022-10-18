import React from 'react';
import { useHistory } from 'react-router-dom';
import { orderBy } from 'lodash';
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
import { getTierIcon } from 'utils';
import {
	SmallEvent,
	Section,
	SectionTitle,
	EventLink,
} from 'containers/Sidebar/components';
import { Spinner } from 'components';

export const SectionHistory = (): JSX.Element => {
	const { eventsData } = useEvents(10);
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
			case 'memberJoined': {
				return getEventMemberJoin(event as EventMemberJoin);
			}
			case 'memberLeft': {
				return getEventMemberLeave(event as EventMemberLeave);
			}
			case 'newGame': {
				return getEventGameAdd(event as EventGameAdd);
			}
			case 'gameRemoved': {
				return getEventGameRemove(event as EventGameRemove);
			}
			case 'complete': {
				return getEventComplete(event as EventComplete);
			}
			case 'tierChange': {
				return getEventGameTierChange(event as EventGameTierChange);
			}
			case 'badgeAdded': {
				return getEventBadgeCreate(event as EventBadgeCreate);
			}
			case 'badgeGiven': {
				return getEventBadgeGiven(event as EventBadgeGet);
			}
			case 'achievementNumberChange': {
				return getEventGameAchievementNumberChange(
					event as EventAchievementNumberChange,
				);
			}
			case 'custom': {
				return getEventCustom(event as EventCustom);
			}
			default:
				return null;
		}
	};

	const sortedEvents = orderBy(eventsData, ['date'], ['desc']).slice(0, 10);

	return (
		<Section>
			<SectionTitle>Last events</SectionTitle>
			{eventsData?.length ? (
				sortedEvents.map((event: Event) => classifyEvents(event))
			) : (
				<Spinner />
			)}
		</Section>
	);
};

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

		return member ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-user-plus"></i>
				<EventLink className="bold" onClick={onUserClick}>
					{' '}
					{member.name}
				</EventLink>{' '}
				has joined the group!
			</SmallEvent>
		) : null;
	};

	const getEventMemberLeave = (event: EventMemberLeave) => {
		const member = members.find((m: Member) => m.steamId === event.memberId);
		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);

		return member ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-user-minus"></i>
				<EventLink className="bold" onClick={onUserClick}>
					{' '}
					{member.name}
				</EventLink>{' '}
				has left the group!
			</SmallEvent>
		) : null;
	};

	const getEventGameAdd = (event: EventGameAdd) => {
		const game = games.find((g: Game) => g.id === event.gameId);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return game ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-plus-square"></i>
				<EventLink className="bold" onClick={onGameClick}>
					{' '}
					{game.title}
				</EventLink>{' '}
				has been curated!
			</SmallEvent>
		) : null;
	};

	const getEventGameRemove = (event: EventGameRemove) => {
		const game = games.find((g: Game) => g.id === event.gameId);

		return game ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-minus-square"></i>
				<EventLink className="bold"> {game.title}</EventLink> has been removed
				from curator!
			</SmallEvent>
		) : null;
	};

	const getEventComplete = (event: EventComplete) => {
		const member = members.find((m: Member) => m.steamId === event.memberId);
		const game = games.find((g: Game) => g.id === event.gameId);

		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return member && game ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-check-square"></i>
				<EventLink className="bold" onClick={onUserClick}>
					{' '}
					{member.name}
				</EventLink>{' '}
				completed{' '}
				<EventLink className="bold" onClick={onGameClick}>
					{game.title}
				</EventLink>
				!
			</SmallEvent>
		) : null;
	};

	const getEventGameTierChange = (event: EventGameTierChange) => {
		const game = games.find((g: Game) => g.id === event.gameId);

		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return game ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-undo-alt"></i>
				<EventLink className="bold" onClick={onGameClick}>
					{' '}
					{game.title}
				</EventLink>{' '}
				changed its tier to <i className={getTierIcon(game.tier, tiersData)} />!
			</SmallEvent>
		) : null;
	};

	const getEventBadgeCreate = (event: EventBadgeCreate) => {
		const game = games.find((g: Game) => g.id === Number(event.gameId));
		const badge = badges.find((b: Badge) => String(b._id) === event.badgeId);

		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return badge && game ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-award"></i>
				<EventLink className="bold" onClick={onGameClick}>
					{' '}
					{game.title}
				</EventLink>{' '}
				got a new badge!
			</SmallEvent>
		) : null;
	};

	const getEventBadgeGiven = (event: EventBadgeGet) => {
		const badge = badges.find((b: Badge) => String(b._id) === event.badgeId);
		const member = members.find((m: Member) => m.steamId === event.memberId);

		const onUserClick = () =>
			member?.steamId && history.push(`/profile/${member.steamId}`);

		return member && badge ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-medal"></i>
				<EventLink className="bold" onClick={onUserClick}>
					{' '}
					{member.name}{' '}
				</EventLink>{' '}
				got a new badge - <span className="bold">{badge.name}</span>!
			</SmallEvent>
		) : null;
	};

	const getEventGameAchievementNumberChange = (
		event: EventAchievementNumberChange,
	) => {
		const game = games.find((g: Game) => g.id === event.gameId);
		const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

		return game ? (
			<SmallEvent key={`sidebar-event-${event._id}`}>
				<i className="fas fa-tasks"></i>
				<EventLink className="bold" onClick={onGameClick}>
					{' '}
					{game.title}
				</EventLink>{' '}
				{event.oldNumber < event.newNumber
					? `got ${event.newNumber - event.oldNumber} new achievements!`
					: `had ${event.oldNumber - event.newNumber} achievements removed!`}
			</SmallEvent>
		) : null;
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
							return <span className="bold">{str}</span>;
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
