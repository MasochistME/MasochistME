import styled from 'styled-components';
import { Game, MemberGame } from '@masochistme/sdk/dist/v1/types';

import { colors } from 'shared/theme';
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

	const membersCompletedGame = membersHavingGame.filter(
		c => c.completionPercentage === 100,
	);
	const avgPlaytime = (
		membersCompletedGame.reduce(
			(sum: number, completion: MemberGame) => sum + completion.playTime,
			0,
		) / membersCompletedGame.length
	).toFixed(2);

	return (
		<StyledGameProfileStats>
			{isLoading && <Skeleton width="100%" height="120px" />}
			{isFetched && (
				<>
					<StatBlock
						title="Number of members that finished the game."
						label={membersCompletedGame.length}
						sublabel="completions"
						icon="fa-solid fa-trophy"
					/>
					<StatBlock
						title="Percentage of members that have the game in their library."
						label={getPercentage(membersHavingGame.length, membersAll.length)}
						sublabel="owned by"
						icon="fa-solid fa-user-check"
					/>
					<StatBlock
						title="Percentage of members that have this game and finished it."
						label={getPercentage(
							membersCompletedGame.length,
							membersHavingGame.length,
						)}
						sublabel="completion rate"
						icon="fa-solid fa-percent"
					/>
					<StatBlock
						title="Average playtime for finishing the game."
						label={`${avgPlaytime} h`}
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
`;
