import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { MemberBadge, Badge, Game } from '@masochistme/sdk/dist/v1/types';

import { Flex } from 'components';
import { BadgeThumbnail, Section } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { useAllGames, useBadges, useMemberBadges } from 'sdk';
import { Size } from 'utils';

type Props = {
	memberId: string;
};

export const MemberProfileBadgesSection = (props: Props): JSX.Element => {
	const { memberId } = props;
	const history = useHistory();

	useActiveTab(TabDict.PROFILE);

	const { gamesData: games } = useAllGames();
	const { memberBadgesData = [] } = useMemberBadges(memberId);
	const { badgesData } = useBadges({
		sort: { points: 'desc' },
	});

	const onBadgeClick = (gameId: number | null) => {
		if (gameId) history.push(`/game/${gameId}`);
	};

	const memberBadges = badgesData
		.filter(badge => {
			return memberBadgesData.find(
				(mb: MemberBadge) => mb.badgeId === String(badge._id),
			);
		})
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
				<StyledMemberProfileBadges justify>
					{memberBadges.length !== 0
						? memberBadges
						: 'This member unlocked no badges yet.'}
				</StyledMemberProfileBadges>
			}
		/>
	);
};

const StyledMemberProfileBadges = styled(Flex)`
	gap: 8px;
	width: 100%;
	flex-flow: row wrap;
`;
