import React from 'react';
import { useHistory } from 'react-router-dom';
import { orderBy } from 'lodash';
import { Badge, Game, Member } from '@masochistme/sdk/dist/v1/types';

import { Flex, Wrapper, Section, BigBadge } from 'components';
import { useActiveTab } from 'shared/hooks';
import {
	useBadges,
	useGames,
	useMemberBadges,
	useMemberLeaderboards,
} from 'sdk';
import { TabDict } from 'shared/config/tabs';

import { Badges } from './styles';
import { ProfileGraphs } from './ProfileGraphs';

type Props = {
	member: Member;
};

export const FullProfile = (props: Props): JSX.Element => {
	const { member } = props;
	const history = useHistory();

	useActiveTab(TabDict.PROFILE);

	const { badgesData } = useBadges();
	const { gamesData: games } = useGames();
	const { leaderData } = useMemberLeaderboards(member.steamId);
	const { memberBadgeData = [] } = useMemberBadges(member.steamId);

	const onBadgeClick = (gameId: number | null) => {
		if (gameId) history.push(`/game/${gameId}`);
	};

	const memberBadges = badgesData.map((badge: Badge) => {
		const game = games.find((g: Game) => g.id === badge.gameId);
		return (
			<BigBadge
				src={badge.img}
				alt="badge"
				title={`${
					badge?.title && badge.title !== 'unknown'
						? badge?.title.toUpperCase()
						: game?.title.toUpperCase()
				} - ${badge.name} (${badge.points} pts)\n"${badge.description}"`}
				key={`member-badge-${String(badge._id)}`}
				onClick={() => onBadgeClick(badge.gameId)}
			/>
		);
	});

	return (
		<Flex column>
			<Wrapper type="page">
				{memberBadgeData.length !== 0 && (
					<Badges>
						<Section style={{ width: '100%' }}>
							<h3>Badges</h3>
							<Flex
								justify
								style={{
									width: '100%',
									display: 'flex',
									flexFlow: 'row wrap',
								}}>
								{memberBadges}
							</Flex>
						</Section>
					</Badges>
				)}
				{leaderData?.sum && <ProfileGraphs member={member} />}
			</Wrapper>
		</Flex>
	);
};
