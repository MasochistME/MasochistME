import styled from 'styled-components';
import { MemberGame } from '@masochistme/sdk/dist/v1/types';

import { colors, media } from 'shared/theme';
import { getPercentage } from 'utils';
import { Flex, Skeleton } from 'components';
import { StatBlock } from 'containers';
import { useLeaderboards, useMemberGames } from 'sdk';

type Props = {
	memberId: string;
};

export const MemberProfileStats = (props: Props) => {
	const { memberId } = props;

	const {
		memberGamesData,
		isLoading: isMemberGamesLoading,
		isFetched: isMemberGamesFetched,
	} = useMemberGames(memberId);
	const {
		leaderboardsData,
		isLoading: isLeaderboardsLoading,
		isFetched: isLeaderboardsFetched,
	} = useLeaderboards();

	const isLoading = isMemberGamesLoading && isLeaderboardsLoading;
	const isFetched = isMemberGamesFetched && isLeaderboardsFetched;

	const memberLeaderboardsPosition =
		leaderboardsData.find(leader => leader.memberId === memberId)?.position ??
		'?';
	const memberCompletions = memberGamesData.filter(
		c => c.completionPercentage === 100,
	);
	const avgPlaytime = (
		memberCompletions.reduce(
			(sum: number, completion: MemberGame) => sum + completion.playTime,
			0,
		) / memberCompletions.length
	).toFixed(2);

	return (
		<StyledGameProfileStats>
			{isLoading && <Skeleton width="100%" height="120px" />}
			{isFetched && (
				<>
					<StatBlock
						title="Position in the MasochistME leaderboards."
						label={memberLeaderboardsPosition}
						icon="fa-solid fa-hashtag"
					/>
					<StatBlock
						title="Number of games that this member completed."
						label={memberCompletions.length}
						sublabel="completions"
						icon="fa-solid fa-trophy"
					/>
					<StatBlock
						title="Average game completion percentage."
						label={getPercentage(
							memberCompletions.length,
							memberGamesData.length,
						)}
						sublabel="completion rate"
						icon="fa-solid fa-percent"
					/>
					<StatBlock
						title="Member's average game completion time."
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
	@media (max-width: ${media.tablets}) {
		flex-wrap: wrap;
	}
`;
