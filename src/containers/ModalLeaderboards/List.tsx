import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useMembers } from 'shared/hooks';
import { ProgressBar, Flex } from 'components';
import {
	User,
	Link,
	UserInfo,
	UserName,
	UserTimes,
	UserAvatar,
} from './styles';
import { UserBadges } from './UserBadges';
import { Member } from '@masochistme/sdk/dist/v1/types';

type Props = {
	game: any;
	compact?: boolean;
};

export const List = (props: Props): JSX.Element => {
	const { game, compact } = props;
	const history = useHistory();
	const { membersData } = useMembers();

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
				<List.User key={`leaderboards-user-${userIndex}`}>
					{!compact && (
						<List.UserTimes>{assignDateIfFinished(user)}</List.UserTimes>
					)}
					<UserAvatar
						className="leaderboards-user-image"
						alt="avatar"
						src={user.avatar}
					/>
					<List.UserInfo>
						<List.UserName>
							{`${user.trophy ? user.trophy : ''}`}
							<List.Link onClick={() => onUserClick(user?.id)}>
								{user.name}
							</List.Link>
						</List.UserName>
						<Flex>
							{!compact && <List.UserBadges user={user} game={game} />}
						</Flex>
					</List.UserInfo>
					<List.ProgressBar percentage={Math.floor(user.percentage)} />
				</List.User>
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

List.User = User;
List.Link = Link;
List.UserInfo = UserInfo;
List.UserName = UserName;
List.UserTimes = UserTimes;
List.UserAvatar = UserAvatar;
List.UserBadges = UserBadges;
List.ProgressBar = ProgressBar;
