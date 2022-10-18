import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Game, MemberGame, Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useCuratedGames } from 'sdk';
import { getGameThumbnail } from 'utils/getGameUrl';
import { colors, fonts, media } from 'shared/theme';
import { Flex, ProgressBar } from 'components';
import { MemberBadges } from 'containers';

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
			<StyledGameTimes align justify column>
				{memberGame.completionPercentage === 100 && (
					<StyledGameCompletionTime>
						{gameCompletionDate}
					</StyledGameCompletionTime>
				)}
				<div style={{ display: 'none' }}>
					{Math.round(Number(memberGame.playTime))}h
				</div>
			</StyledGameTimes>
			<StyledGameThumbnail src={gameThumbnail} alt="Game thumbnail" />
			<StyledGameInfo align>
				<i className={gameTierIcon} />
				<StyledGameTitle onClick={onGameClick}>{gameTitle}</StyledGameTitle>
			</StyledGameInfo>
			<MemberBadges memberId={steamId} gameId={memberGame.gameId} />
			<ProgressBar percentage={memberGame.completionPercentage} />
		</StyledMemberGame>
	);
};

const StyledMemberGame = styled(Flex)`
	width: 100%;
	height: 37px;
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
	margin: 0;
	padding: 0;
	min-height: 37px;
	max-height: 37px;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledGameInfo = styled(Flex)`
	width: 100%;
	justify-content: flex-start;
	margin: 0 10px;
`;

const StyledGameTimes = styled(Flex)`
	font-size: 0.7em;
	font-family: ${fonts.Verdana};
	color: ${colors.superLightGrey};
	width: 80px;
	min-width: 80px;
	margin-left: 6px;
`;

const StyledGameCompletionTime = styled.div`
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledGameTitle = styled.div`
	margin-left: 5px;
	&:hover {
		color: ${colors.white};
	}
`;
