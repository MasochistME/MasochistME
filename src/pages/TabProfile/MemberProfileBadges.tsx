import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Game } from '@masochistme/sdk/dist/v1/types';

import { Flex } from 'components';
import { BadgeThumbnail, Section } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { useAllGames, useBadges, useMemberBadges } from 'sdk';
import { Size } from 'utils';

type Props = {
	memberId: string;
};

export const MemberProfileBadges = (props: Props): JSX.Element => {
	const { memberId } = props;
	const history = useHistory();

	useActiveTab(TabDict.PROFILE);

	const { gamesData: games } = useAllGames();
	const { badgesData } = useBadges();
	const { memberBadgesData = [] } = useMemberBadges(memberId);

	const onBadgeClick = (gameId: number | null) => {
		if (gameId) history.push(`/game/${gameId}`);
	};

	const memberBadges = memberBadgesData
		.map(memberBadge => {
			return badgesData.find(
				(b: Badge) => String(b._id) === memberBadge.badgeId,
			);
		})
		.filter(Boolean)
		.map(badge => {
			if (!badge) return;
			const game = games.find((g: Game) => g.id === badge.gameId);
			if (!game || game.isCurated || game.isProtected) {
				return (
					<BadgeThumbnail
						badge={badge as Badge}
						size={Size.BIG}
						key={`member-badge-${String(badge._id)}`}
						onClick={() => onBadgeClick(badge.gameId)}
					/>
				);
			}
		})
		.filter(Boolean);

	return (
		<Section
			title="Badges"
			minWidth="450px"
			maxWidth="450px"
			content={
				<StyledMemberProfileBadges justify gap={8}>
					{memberBadges.length !== 0
						? memberBadges
						: 'This member unlocked no badges yet.'}
				</StyledMemberProfileBadges>
			}
		/>
	);
};

const StyledMemberProfileBadges = styled(Flex)`
	width: 100%;
	flex-flow: row wrap;
`;
