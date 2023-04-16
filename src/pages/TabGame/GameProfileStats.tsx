import { Game } from '@masochistme/sdk/dist/v1/types';
import styled from 'styled-components';

import { Flex, QueryBoundary, Skeleton } from 'components';
import { StatBlock } from 'containers';
import { useGameCompletion } from 'hooks';
import { useCuratorMembers, useLeaderboardsGames } from 'sdk';
import { ColorTokens, media, useTheme } from 'styles';
import { getPercentage } from 'utils';

type Props = {
	game?: Game;
};

export const GameProfileStats = (props: Props) => {
	const { game } = props;

	if (!game) return null;
	return (
		<QueryBoundary fallback={<Skeleton width="100%" height="12rem" />}>
			<GameProfileStatsBoundary game={game} />
		</QueryBoundary>
	);
};

const GameProfileStatsBoundary = (props: Required<Props>) => {
	const { colorTokens } = useTheme();
	const { game } = props;

	const { leaderboardsData, isLoading } = useLeaderboardsGames();
	const gameLeaderboards = leaderboardsData.find(
		leaderboards => leaderboards.gameId === game.id,
	);

	const { membersData: membersAll } = useCuratorMembers();
	const { gameCompletions } = useGameCompletion(game.id);

	const membersStartingGame = gameCompletions.filter(
		m => m.completionPercentage !== 0,
	);

	const avgPlaytime =
		!gameLeaderboards?.avgPlaytime ||
		Number.isNaN(gameLeaderboards?.avgPlaytime)
			? '—'
			: `${gameLeaderboards.avgPlaytime.toFixed(2)} h`;

	const completionTimeShortest = gameLeaderboards?.times?.shortestCompletion
		? `${gameLeaderboards?.times.shortestCompletion.toFixed(2)} h`
		: '—';
	const completionTimeLongest = gameLeaderboards?.times?.longestCompletion
		? `${gameLeaderboards?.times.longestCompletion.toFixed(2)} h`
		: '—';
	const completionPercentage = getPercentage(
		gameLeaderboards?.completions?.base ?? 0,
		membersStartingGame.length,
	);

	return (
		<StyledGameProfileStats colorTokens={colorTokens}>
			<StatBlock
				title={
					<StatBlock.Title>
						Number of members that finished the game
					</StatBlock.Title>
				}
				label={gameLeaderboards?.completions?.base ?? '—'}
				sublabel="completions"
				icon="Trophy"
			/>
			<StatBlock
				title={
					<Flex column>
						<StatBlock.Title>
							% of members that have the game in their library
						</StatBlock.Title>
						<StatBlock.Subtitle>
							Owned by:
							<span style={{ fontWeight: 'bold' }}>
								{gameLeaderboards?.owners ?? '—'}
							</span>
							members
						</StatBlock.Subtitle>
					</Flex>
				}
				label={getPercentage(gameLeaderboards?.owners ?? 0, membersAll.length)}
				sublabel="owned by"
				icon="UserCheck"
			/>
			<StatBlock
				title={
					<Flex column>
						<StatBlock.Title>
							% of members that have this game and finished it
						</StatBlock.Title>
						<StatBlock.Subtitle>
							Completed by:
							<span style={{ fontWeight: 'bold' }}>
								{gameLeaderboards?.completions?.base ?? '—'}
							</span>
							members
						</StatBlock.Subtitle>
					</Flex>
				}
				label={completionPercentage}
				sublabel="completion rate"
				icon="Percent"
			/>
			<StatBlock
				title={
					<Flex column>
						<StatBlock.Title>
							Average playtime for finishing the game
						</StatBlock.Title>
						<StatBlock.Subtitle>
							Shortest completion time:
							<span style={{ fontWeight: 'bold' }}>
								{completionTimeShortest}
							</span>
						</StatBlock.Subtitle>
						<StatBlock.Subtitle>
							Longest completion time:
							<span style={{ fontWeight: 'bold' }}>
								{completionTimeLongest}
							</span>
						</StatBlock.Subtitle>
					</Flex>
				}
				label={avgPlaytime}
				sublabel="avg completion time"
				icon="Clock"
			/>
		</StyledGameProfileStats>
	);
};

const StyledGameProfileStats = styled(Flex)<{ colorTokens: ColorTokens }>`
	justify-content: space-evenly;
	background-color: ${({ colorTokens }) => colorTokens['core-tertiary-bg']}66;
	gap: var(--size-16);
	padding: var(--size-24) 0 var(--size-32) 0;
	@media (max-width: ${media.tablets}) {
		flex-wrap: wrap;
	}
`;
