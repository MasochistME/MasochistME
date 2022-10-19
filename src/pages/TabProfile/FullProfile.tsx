import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Game, Member } from '@masochistme/sdk/dist/v1/types';

import { Flex, Tooltip } from 'components';
import { BadgeThumbnail } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import {
	useAllGames,
	useBadges,
	useMemberBadges,
	useMemberLeaderboards,
} from 'sdk';

import { Badges } from './styles';
import { ProfileGraphs } from './ProfileGraphs';

type Props = {
	member: Member;
};

export const FullProfile = (props: Props): JSX.Element => {
	const { member } = props;
	const history = useHistory();

	useActiveTab(TabDict.PROFILE);

	const { gamesData: games } = useAllGames();
	const { badgesData } = useBadges();
	const { leaderData } = useMemberLeaderboards(member.steamId);
	const { memberBadgesData = [] } = useMemberBadges(member.steamId);

	const onBadgeClick = (gameId: number | null) => {
		if (gameId) history.push(`/game/${gameId}`);
	};

	const memberBadges = badgesData.map((badge: Badge) => {
		const game = games.find((g: Game) => g.id === badge.gameId);
		if (!game || game.isCurated || game.isProtected) {
			return (
				<Tooltip
					content={
						<Flex column>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{(game?.title ?? 'unknown game').toUpperCase()}
								</span>{' '}
								- {`${badge.name} (${badge.points} pts)`}
							</div>
							<span style={{ maxWidth: '300px', fontStyle: 'italic' }}>
								{badge.description}
							</span>
						</Flex>
					}>
					<BadgeThumbnail
						badge={badge}
						key={`member-badge-${String(badge._id)}`}
						onClick={() => onBadgeClick(badge.gameId)}
					/>
				</Tooltip>
			);
		}
	});

	return (
		<Flex column>
			<div>
				{memberBadgesData.length !== 0 && (
					<Badges>
						<div style={{ width: '100%' }}>
							<h3>Badges</h3>
							<BadgeSection justify>{memberBadges}</BadgeSection>
						</div>
					</Badges>
				)}
				{leaderData?.sum && <ProfileGraphs member={member} />}
			</div>
		</Flex>
	);
};

const BadgeSection = styled(Flex)`
	width: 100%;
	flex-flow: row wrap;
`;
