import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Game, MemberGame, Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useCuratedGames } from 'sdk';
import { media, useTheme, ColorTokens } from 'styles';
import { Flex, Icon, IconType, DateBlock, ProgressBar, Size } from 'components';
import { MemberBadges, GameThumbnail } from 'containers';

type Props = {
	steamId: string;
	memberGame: MemberGame;
};

export const MemberLeaderboardsGame = (props: Props): JSX.Element => {
	const { colorTokens } = useTheme();
	const { steamId, memberGame } = props;
	const navigate = useNavigate();

	const { gamesData } = useCuratedGames();
	const { tiersData } = useTiers();

	const gameData = gamesData.find((g: Game) => g.id === memberGame.gameId);

	const gameCompletionDate = memberGame?.mostRecentAchievementDate;
	const gameTitle = gameData?.title ?? '—';
	const gameTierIcon = (tiersData.find(
		(tier: Tier) => tier.id === gameData?.tier,
	)?.icon ?? 'Spin') as IconType;

	const onGameClick = () => {
		navigate(`/game/${memberGame.gameId}`);
	};

	return (
		<StyledMemberGame align colorTokens={colorTokens}>
			<DateBlock
				date={
					memberGame.completionPercentage === 100
						? gameCompletionDate
						: undefined
				}
			/>
			<StyledGameInfo align gap={8}>
				<GameThumbnail
					game={gameData}
					size={Size.SMALL}
					onClick={onGameClick}
				/>
				<Icon icon={gameTierIcon} size={Size.MICRO} />
				<StyledGameTitle onClick={onGameClick} colorTokens={colorTokens}>
					{gameTitle}
				</StyledGameTitle>
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

const StyledMemberGame = styled(Flex)<{ colorTokens: ColorTokens }>`
	width: 100%;
	height: var(--size-36);
	gap: var(--size-4);
	text-align: left;
	border-bottom: var(--size-1) solid
		${({ colorTokens }) => colorTokens['common-color--shadow']}88;
	border-right: var(--size-1) solid
		${({ colorTokens }) => colorTokens['common-color--shadow']}88;
	border-top: var(--size-1) solid
		${({ colorTokens }) => colorTokens['semantic-color--interactive']}99;
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
		margin-left: var(--size-6);
	}
	i {
		width: var(--size-16);
	}
`;

const StyledGameTitle = styled.div<{ colorTokens: ColorTokens }>`
	cursor: pointer;
	@media (max-width: ${media.smallTablets}) {
		display: none;
	}
	&:hover {
		color: ${({ colorTokens }) => colorTokens['core-tertiary-text']};
	}
`;
