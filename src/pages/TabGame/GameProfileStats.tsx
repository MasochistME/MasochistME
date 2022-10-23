import styled from 'styled-components';
import { Game, MemberGame } from '@masochistme/sdk/dist/v1/types';

import { colors, media } from 'shared/theme';
import { getPercentage } from 'utils';
import { Flex, Skeleton } from 'components';
import { StatBlock } from 'containers';
import { useGameCompletions, useCuratorMembers } from 'sdk';

type Props = {
	game: Game;
};

export const GameProfileStats = (props: Props) => {
	const { game } = props;

	const {
		membersData: membersAll,
		isLoading: isMembersLoading,
		isFetched: isMembersFetched,
	} = useCuratorMembers();
	const {
		completionsData: membersHavingGame,
		isLoading: isCompletionsLoading,
		isFetched: isCompletionsFetched,
	} = useGameCompletions({
		filter: { gameId: game?.id },
	});

	const isLoading = isMembersLoading && isCompletionsLoading;
	const isFetched = isMembersFetched && isCompletionsFetched;

	/**
	 * List of members that have completed the game.
	 */
	const membersCompletedGame = membersHavingGame.filter(
		c => c.completionPercentage === 100,
	);
	console.log(
		membersCompletedGame
			.map(completion => ({
				completionPercentage: completion.completionPercentage,
				playTime: completion.playTime,
				memberId: completion.memberId,
			}))
			.sort((a, b) => a.playTime - b.playTime),
	);

	/**
	 * Average time needed to finish the game.
	 */
	const avgPlaytime =
		membersCompletedGame.reduce(
			(sum: number, completion: MemberGame) => sum + completion.playTime,
			0,
		) / membersCompletedGame.length;
	console.log(avgPlaytime);
	const fixedAvgPlaytime = Number.isNaN(avgPlaytime)
		? '—'
		: `${avgPlaytime.toFixed(2)} h`;

	/**
	 * Longest and shortest time needed to complete the game.
	 */
	const gameCompletionTimes = membersCompletedGame.map(
		completion => completion.playTime,
	);
	const completionTimeShortest = gameCompletionTimes.length
		? `${Math.min(...gameCompletionTimes)} h`
		: '—';
	const completionTimeLongest = gameCompletionTimes.length
		? `${Math.max(...gameCompletionTimes)} h`
		: '—';

	return (
		<StyledGameProfileStats>
			{isLoading && <Skeleton width="100%" height="120px" />}
			{isFetched && (
				<>
					<StatBlock
						title={
							<StatBlock.Title>
								Number of members that finished the game
							</StatBlock.Title>
						}
						label={membersCompletedGame.length}
						sublabel="completions"
						icon="fa-solid fa-trophy"
					/>
					<StatBlock
						title={
							<Flex column>
								<StatBlock.Title>
									% of members that have the game in their library
								</StatBlock.Title>
								<StatBlock.Subtitle>
									Owned by:{' '}
									<span style={{ fontWeight: 'bold' }}>
										{membersHavingGame.length}
									</span>{' '}
									members
								</StatBlock.Subtitle>
							</Flex>
						}
						label={getPercentage(membersHavingGame.length, membersAll.length)}
						sublabel="owned by"
						icon="fa-solid fa-user-check"
					/>
					<StatBlock
						title={
							<Flex column>
								<StatBlock.Title>
									% of members that have this game and finished it
								</StatBlock.Title>
								<StatBlock.Subtitle>
									Completed by:{' '}
									<span style={{ fontWeight: 'bold' }}>
										{membersCompletedGame.length}
									</span>{' '}
									members
								</StatBlock.Subtitle>
							</Flex>
						}
						label={getPercentage(
							membersCompletedGame.length,
							membersHavingGame.length,
						)}
						sublabel="completion rate"
						icon="fa-solid fa-percent"
					/>
					<StatBlock
						title={
							<Flex column>
								<StatBlock.Title>
									Average playtime for finishing the game
								</StatBlock.Title>
								<StatBlock.Subtitle>
									Shortest completion time:{' '}
									<span style={{ fontWeight: 'bold' }}>
										{completionTimeShortest}
									</span>
								</StatBlock.Subtitle>
								<StatBlock.Subtitle>
									Longest completion time:{' '}
									<span style={{ fontWeight: 'bold' }}>
										{completionTimeLongest}
									</span>
								</StatBlock.Subtitle>
							</Flex>
						}
						label={fixedAvgPlaytime}
						sublabel="avg completion time"
						icon="fa-solid fa-clock"
					/>
				</>
			)}
		</StyledGameProfileStats>
	);
};

const StyledGameProfileStats = styled(Flex)`
	justify-content: space-evenly;
	background-color: ${colors.black}66;
	gap: 16px;
	padding: 24px 0 32px 0;
	@media (max-width: ${media.tablets}) {
		flex-wrap: wrap;
	}
`;
