import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Game, Member } from '@masochistme/sdk/dist/v1/types';

import { Flex, Wrapper, Section, BigBadge } from 'components';
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

	const getBadgeTooltip = (badge: Badge, game?: Game) => {
		const title =
			badge?.title && badge.title !== 'unknown'
				? badge.title
				: game?.title ?? 'unknown';
		return `${title.toUpperCase()} - ${badge.name} (${badge.points} pts)\n"${
			badge.description
		}`;
	};

	const memberBadges = badgesData.map((badge: Badge) => {
		const game = games.find((g: Game) => g.id === badge.gameId);
		if (!game || game.isCurated || game.isProtected) {
			const tooltip = getBadgeTooltip(badge, game);
			return (
				<BigBadge
					src={badge.img}
					alt={`Badge`}
					title={tooltip}
					key={`member-badge-${String(badge._id)}`}
					onClick={() => onBadgeClick(badge.gameId)}
				/>
			);
		}
	});

	return (
		<Flex column>
			<Wrapper type="page">
				{memberBadgesData.length !== 0 && (
					<Badges>
						<Section style={{ width: '100%' }}>
							<h3>Badges</h3>
							<BadgeSection justify>{memberBadges}</BadgeSection>
						</Section>
					</Badges>
				)}
				{leaderData?.sum && <ProfileGraphs member={member} />}
			</Wrapper>
		</Flex>
	);
};

const BadgeSection = styled(Flex)`
	width: 100%;
	flex-flow: row wrap;
`;
