import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { media, useTheme, ColorTokens } from 'styles';
import { getPercentage } from 'utils';
import { Flex } from 'components';
import { StatBlock } from 'containers';
import {
	useGameCompletions,
	useCuratorMembers,
	useLeaderboardsGames,
} from 'sdk';

type Props = {
	game: Game;
};

export const GameProfileStats = (props: Props) => {
	const { colorTokens } = useTheme();
	const { game } = props;

	const { leaderboardsData, isLoading } = useLeaderboardsGames();
	const gameLeaderboards = leaderboardsData.find(
		leaderboards => leaderboards.gameId === game.id,
	);

	const { membersData: membersAll } = useCuratorMembers();
	const { completionsData: membersHavingGame } = useGameCompletions({
		filter: { gameId: game?.id },
	});

	const avgPlaytime =
		!gameLeaderboards?.avgPlaytime ||
		Number.isNaN(gameLeaderboards?.avgPlaytime)
			? '—'
			: `${gameLeaderboards.avgPlaytime.toFixed(2)} h`;

	const completionTimeShortest = gameLeaderboards?.times?.shortestCompletion
		? `${gameLeaderboards?.times.shortestCompletion} h`
		: '—';
	const completionTimeLongest = gameLeaderboards?.times?.longestCompletion
		? `${gameLeaderboards?.times.longestCompletion} h`
		: '—';

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
				isLoading={isLoading}
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
				isLoading={isLoading}
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
				label={getPercentage(
					gameLeaderboards?.completions?.base ?? 0,
					membersHavingGame.length,
				)}
				sublabel="completion rate"
				icon="Percent"
				isLoading={isLoading}
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
				isLoading={isLoading}
			/>
		</StyledGameProfileStats>
	);
};

const StyledGameProfileStats = styled(Flex)<{ colorTokens: ColorTokens }>`
	justify-content: space-evenly;
	background-color: ${({ colorTokens }) => colorTokens['core-tertiary-bg']}66;
	gap: 16px;
	padding: 24px 0 32px 0;
	@media (max-width: ${media.tablets}) {
		flex-wrap: wrap;
	}
`;
