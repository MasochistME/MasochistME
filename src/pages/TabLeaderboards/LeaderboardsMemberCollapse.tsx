import React, { useMemo } from 'react';
import { orderBy } from 'lodash';
import styled from 'styled-components';
import { MemberGame } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useMemberGames } from 'sdk';
import { media, colors } from 'shared/theme';
import { Spinner } from 'components';

import { LeaderboardsMemberGame } from './LeaderboardsMemberGame';

type Props = {
	steamId: string;
};

export const LeaderboardsMemberCollapse = (props: Props): JSX.Element => {
	const { steamId } = props;

	const { gamesData, isFetched: isGamesFetched } = useCuratedGames();
	const { memberGamesData, isFetched: isMemberGamesFetched } =
		useMemberGames(steamId);

	const isLoaded = isGamesFetched && isMemberGamesFetched;

	const gameList = useMemo(() => {
		const sortedMemberGames: MemberGame[] = orderBy(
			memberGamesData,
			['completionPercentage', 'lastUnlocked'],
			['desc', 'desc'],
		).filter(memberGame => {
			const game = gamesData.find(g => g.id === memberGame.gameId);
			if (game && (game.isCurated || game.isProtected)) return true;
			return false;
		});
		return sortedMemberGames;
	}, [gamesData, memberGamesData]);

	return (
		<StyledMemberGameList>
			{!isLoaded && <Spinner />}
			{isLoaded &&
				gameList.map(memberGame => (
					<LeaderboardsMemberGame
						key={`game-${memberGame.gameId}`}
						steamId={steamId}
						memberGame={memberGame}
					/>
				))}
		</StyledMemberGameList>
	);
};

export const StyledMemberGameList = styled.div`
	display: flex;
	flex-direction: column;
	transition: height 1s;
	width: 90%;
	box-sizing: border-box;
	border-left: 1px solid ${colors.superDarkGrey};
	border-right: 1px solid ${colors.superDarkGrey};
	background-color: ${colors.darkBlueTransparent};
	&:first-child {
		border-top: none;
	}
	@media (max-width: ${media.smallNetbooks}) {
		padding: 0;
		width: 100%;
	}
`;
