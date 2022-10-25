import styled from 'styled-components';
import { MemberGame } from '@masochistme/sdk/dist/v1/types';

import { useLeaderboards, useMemberGames, useTiers } from 'sdk';
import { useMemberBadgesFilter } from 'shared/hooks';
import { colors, media } from 'shared/theme';
import { getPercentage } from 'utils';
import { Flex, Skeleton } from 'components';
import { StatBlock } from 'containers';

type Props = {
	memberId: string;
};

export const MemberProfileStats = (props: Props) => {
	const { memberId } = props;

	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();
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

	const memberBadgesData = useMemberBadgesFilter(memberId);

	const isLoading =
		isMemberGamesLoading && isLeaderboardsLoading && isTiersLoading;
	const isFetched =
		isMemberGamesFetched && isLeaderboardsFetched && isTiersFetched;

	const memberLeaderData = leaderboardsData.find(
		leader => leader.memberId === memberId,
	);
	const memberCompletions = memberGamesData.filter(
		c => c.completionPercentage === 100,
	);
	const memberGamesStarted = memberGamesData.filter(
		c => c.completionPercentage !== 0,
	);

	/**
	 * Average time needed to finish the game.
	 */
	const avgPlaytime = (
		memberCompletions.reduce(
			(sum: number, completion: MemberGame) => sum + completion.playTime,
			0,
		) / memberCompletions.length
	).toFixed(2);

	/**
	 * Longest and shortest completion times.
	 */
	const gameCompletionTimes = memberCompletions.map(
		completion => completion.playTime,
	);
	const completionTimeShortest = Math.min(...gameCompletionTimes);
	const completionTimeLongest = Math.max(...gameCompletionTimes);

	/**
	 * Member completions by tier.
	 */
	const completionsByTier = memberLeaderData?.games.map((game, index) => {
		const tierIcon =
			tiersData.find(tier => tier.id === game.tier)?.icon ??
			'fa-solid fa-circle-question';
		return (
			<StatBlock.Subtitle key={`statblock-completions-${index}`}>
				<i className={tierIcon} /> -{' '}
				<span style={{ fontWeight: 'bold' }}>{game.total}</span>
			</StatBlock.Subtitle>
		);
	});

	const pointsTotal = memberLeaderData?.games.map((game, index) => {
		const tierIcon =
			tiersData.find(tier => tier.id === game.tier)?.icon ??
			'fa-solid fa-circle-question';
		return (
			<StatBlock.Subtitle key={`statblock-points-${index}`}>
				<i className={tierIcon} /> -{' '}
				<span style={{ fontWeight: 'bold' }}>{game.points}</span> pts
			</StatBlock.Subtitle>
		);
	});

	const badgesTotal = (
		<StatBlock.Subtitle>
			<i className="fas fa-medal" /> -{' '}
			<span style={{ fontWeight: 'bold' }}>
				{memberLeaderData?.badges.points}
			</span>{' '}
			pts
		</StatBlock.Subtitle>
	);

	const badgesUnlocked = (
		<StatBlock.Subtitle>
			<i className="fas fa-medal" /> -{' '}
			<span style={{ fontWeight: 'bold' }}>{memberBadgesData.length}</span>
		</StatBlock.Subtitle>
	);

	return (
		<StyledGameProfileStats>
			{isLoading && <Skeleton width="100%" height="120px" />}
			{isFetched && (
				<>
					<StatBlock
						title={
							<Flex column>
								<StatBlock.Title>
									Position in the MasochistME leaderboards
								</StatBlock.Title>
							</Flex>
						}
						label={memberLeaderData?.position ?? '?'}
						icon="fa-solid fa-hashtag"
					/>
					<StatBlock
						title={
							<Flex column>
								<StatBlock.Title>Points total</StatBlock.Title>
								{pointsTotal}
								<StatBlock.Title>Badge points</StatBlock.Title>
								{badgesTotal}
							</Flex>
						}
						label={memberLeaderData?.sum ?? '?'}
						sublabel="points total"
						icon="fa-solid fa-plus-circle"
					/>
					<StatBlock
						title={
							<Flex column>
								<StatBlock.Title>Curated games completed</StatBlock.Title>
								{completionsByTier}
								<StatBlock.Title>Badges unlocked</StatBlock.Title>
								{badgesUnlocked}
							</Flex>
						}
						label={memberCompletions.length}
						sublabel="completions"
						icon="fa-solid fa-trophy"
					/>
					<StatBlock
						title={
							<Flex column>
								<StatBlock.Title>
									Average curated game completion percentage
								</StatBlock.Title>
							</Flex>
						}
						label={getPercentage(
							memberCompletions.length,
							memberGamesStarted.length,
						)}
						sublabel="completion rate"
						icon="fa-solid fa-percent"
					/>
					<StatBlock
						title={
							<Flex column>
								<StatBlock.Title>
									Member's average curated game completion time
								</StatBlock.Title>
								<StatBlock.Subtitle>
									Shortest completion time:{' '}
									<span style={{ fontWeight: 'bold' }}>
										{completionTimeShortest} h
									</span>
								</StatBlock.Subtitle>
								<StatBlock.Subtitle>
									Longest completion time:{' '}
									<span style={{ fontWeight: 'bold' }}>
										{completionTimeLongest} h
									</span>
								</StatBlock.Subtitle>
							</Flex>
						}
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
