import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Game, MemberGame, Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useCuratedGames } from 'sdk';
import { getGameThumbnail } from 'utils/getGameUrl';
import { colors, media } from 'shared/theme';
import { Flex, DateBlock, ProgressBar } from 'components';
import { MemberBadges } from 'containers';
import { Size } from 'utils';

type Props = {
	steamId: string;
	memberGame: MemberGame;
};

export const LeaderboardsMemberGame = (props: Props): JSX.Element => {
	const { steamId, memberGame } = props;
	const history = useHistory();

	const { gamesData } = useCuratedGames();
	const { tiersData } = useTiers();

	const gameData = gamesData.find((g: Game) => g.id === memberGame.gameId);

	const gameCompletionDate = memberGame?.mostRecentAchievementDate;
	const gameTitle = gameData?.title ?? 'unknown';
	const gameThumbnail = getGameThumbnail(gameData?.id);
	const gameTierIcon =
		tiersData.find((tier: Tier) => tier.id === gameData?.tier)?.icon ??
		'fas fa-spinner';

	const onGameClick = () => {
		history.push(`/game/${memberGame.gameId}`);
	};

	return (
		<StyledMemberGame align>
			{memberGame.completionPercentage === 100 && (
				<DateBlock date={gameCompletionDate} />
			)}
			<StyledGameInfo align gap={8}>
				<StyledGameThumbnail src={gameThumbnail} alt="Game thumbnail" />
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
	border-bottom: 1px solid ${colors.newDark};
	border-top: 1px solid ${colors.newMediumGrey};
	&:first-child {
		border-top: none;
	}
	&:last-child {
		border-bottom: none;
	}
`;

const StyledGameThumbnail = styled.img`
	min-height: 37px;
	max-height: 37px;
	@media (max-width: ${media.tablets}) {
		display: none;
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
	&:hover {
		color: ${colors.white};
	}
`;
