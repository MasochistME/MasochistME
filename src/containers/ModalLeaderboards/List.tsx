import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useCuratorMembers } from 'sdk';
import { ProgressBar, Flex } from 'components';
import {
	User,
	Link,
	UserInfo,
	UserName,
	UserTimes,
	UserAvatar,
} from './components';
import { UserBadges } from './UserBadges';
import { Member } from '@masochistme/sdk/dist/v1/types';

type Props = {
	game: any;
	compact?: boolean;
};

export const List = (props: Props): JSX.Element => {
	const { game, compact } = props;
	const history = useHistory();
	const { membersData } = useCuratorMembers();

	const assignDateIfFinished = (leaderboards: any): string | JSX.Element =>
		leaderboards?.percentage === 100 ? (
			new Date(leaderboards?.lastUnlocked * 1000).toLocaleString()
		) : (
			<Flex justify align style={{ width: '100%' }}>
				—
			</Flex>
		);

	const leaderboards = (game?.players ?? []).map((player: any) => {
		const member = membersData.find((m: Member) => m.steamId === player.id);
		if (!member) return;
		return {
			id: member.steamId,
			name: member.name,
			avatar: member.avatar,
			gameId: game.id,
			trophy: player.trophy,
			percentage: player.percentage,
			lastUnlocked: player.lastUnlocked,
			playtime: player.playtime,
			// badges: member.badges, // TODO inject member badges here
		};
	});

	const onUserClick = (id?: string) => id && history.push(`/profile/${id}`);

	return (
		<LeaderboardsList>
			{leaderboards.map((user: any, userIndex: number) => (
				<User key={`leaderboards-user-${userIndex}`}>
					{!compact && <UserTimes>{assignDateIfFinished(user)}</UserTimes>}
					<UserAvatar
						className="leaderboards-user-image"
						alt="avatar"
						src={user.avatar}
					/>
					<UserInfo>
						<UserName>
							{`${user.trophy ? user.trophy : ''}`}
							<Link onClick={() => onUserClick(user?.id)}>{user.name}</Link>
						</UserName>
						<Flex>{!compact && <UserBadges user={user} game={game} />}</Flex>
					</UserInfo>
					<ProgressBar percentage={Math.floor(user.percentage)} />
				</User>
			))}
		</LeaderboardsList>
	);
};

const LeaderboardsList = styled.ul`
	width: 100%;
	list-style-type: none;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
`;
