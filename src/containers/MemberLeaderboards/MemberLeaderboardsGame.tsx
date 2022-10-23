import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Game, MemberGame, Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useCuratedGames } from 'sdk';
import { colors, media } from 'shared/theme';
import { Flex, DateBlock, ProgressBar } from 'components';
import { MemberBadges, GameThumbnail } from 'containers';
import { Size } from 'utils';

type Props = {
	steamId: string;
	memberGame: MemberGame;
};

export const MemberLeaderboardsGame = (props: Props): JSX.Element => {
	const { steamId, memberGame } = props;
	const history = useHistory();

	const { gamesData } = useCuratedGames();
	const { tiersData } = useTiers();

	const gameData = gamesData.find((g: Game) => g.id === memberGame.gameId);

	const gameCompletionDate = memberGame?.mostRecentAchievementDate;
	const gameTitle = gameData?.title ?? 'unknown';
	const gameTierIcon =
		tiersData.find((tier: Tier) => tier.id === gameData?.tier)?.icon ??
		'fas fa-spinner';

	const onGameClick = () => {
		history.push(`/game/${memberGame.gameId}`);
	};

	return (
		<StyledMemberGame align>
			<DateBlock
				date={
					memberGame.completionPercentage === 100
						? gameCompletionDate
						: undefined
				}
			/>
			<StyledGameInfo align gap={8}>
				<GameThumbnail game={gameData} size={Size.BIG} />
				<i className={gameTierIcon} />
				<StyledGameTitle onClick={onGameClick}>{gameTitle}</StyledGameTitle>
			</StyledGameInfo>
			<MemberBadges
				size={Size.TINY}
				memberId={steamId}
				gameId={memberGame.gameId}
			/>
			<ProgressBar percentage={memberGame.completionPercentage} />
		</StyledMemberGame>
	);
};

const StyledMemberGame = styled(Flex)`
	width: 100%;
	height: 37px;
	gap: 4px;
	text-align: left;
	border-bottom: 1px solid ${colors.newDark};
	border-top: 1px solid ${colors.newMediumGrey};
	&:first-child {
		border-top: none;
	}
	&:last-child {
		border-bottom: none;
	}
`;

const StyledGameInfo = styled(Flex)`
	width: 100%;
	justify-content: flex-start;
	@media (max-width: ${media.tablets}) {
		margin-left: 6px;
	}
	i {
		width: 16px;
	}
`;

const StyledGameTitle = styled.div`
	cursor: pointer;
	@media (max-width: ${media.smallTablets}) {
		display: none;
	}
	&:hover {
		color: ${colors.white};
	}
`;
