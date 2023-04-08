import styled from 'styled-components';
import {
	MemberGame,
	PatreonTier,
	PatronTier,
} from '@masochistme/sdk/dist/v1/types';

import { useLeaderboardsMembers, useMemberGames, useTiers } from 'sdk';
import { useMemberBadgesFilter } from 'hooks';
import { media } from 'styles';
import { getPercentage, ColorMap } from 'utils';
import { Flex, Icon, IconType, Skeleton, QueryBoundary } from 'components';
import { StatBlock } from 'containers';

type Props = {
	memberId: string;
	patron?: Partial<PatreonTier>;
};

export const MemberProfileStats = (props: Props) => (
	<QueryBoundary fallback={<Skeleton width="100%" height="12rem" />}>
		<MemberProfileStatsBoundary {...props} />
	</QueryBoundary>
);

const MemberProfileStatsBoundary = (props: Props) => {
	const { memberId, patron } = props;

	const { tiersData } = useTiers();
	const { memberGamesData } = useMemberGames(memberId);
	const { leaderboardsData } = useLeaderboardsMembers();

	const getStatTier = () => {
		if (patron?.id === PatronTier.TIER4) return ColorMap.GOLD;
		return ColorMap.DEFAULT;
	};

	const { memberBadges } = useMemberBadgesFilter(memberId);

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
		const tierIcon = (tiersData.find(tier => tier.id === game.tier)?.icon ??
			'QuestionCircle') as IconType;
		return (
			<StatBlock.Subtitle key={`statblock-completions-${index}`}>
				<Icon icon={tierIcon} /> -{' '}
				<span style={{ fontWeight: 'bold' }}>{game.total}</span>
			</StatBlock.Subtitle>
		);
	});

	const pointsTotal = memberLeaderData?.games.map((game, index) => {
		const tierIcon = (tiersData.find(tier => tier.id === game.tier)?.icon ??
			'QuestionCircle') as IconType;
		return (
			<StatBlock.Subtitle key={`statblock-points-${index}`}>
				<Icon icon={tierIcon} /> -{' '}
				<span style={{ fontWeight: 'bold' }}>{game.points}</span> pts
			</StatBlock.Subtitle>
		);
	});

	const badgesTotal = (
		<StatBlock.Subtitle>
			<Icon icon="Medal" /> -{' '}
			<span style={{ fontWeight: 'bold' }}>
				{memberLeaderData?.badges.points}
			</span>{' '}
			pts
		</StatBlock.Subtitle>
	);

	const badgesUnlocked = (
		<StatBlock.Subtitle>
			<Icon icon="Medal" /> -{' '}
			<span style={{ fontWeight: 'bold' }}>{memberBadges.length}</span>
		</StatBlock.Subtitle>
	);

	return (
		<StyledGameProfileStats>
			<StatBlock
				title={
					<Flex column>
						<StatBlock.Title>
							Position in the MasochistME leaderboards
						</StatBlock.Title>
					</Flex>
				}
				label={memberLeaderData?.position ?? '—'}
				tier={getStatTier()}
				icon="Hashtag"
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
				label={memberLeaderData?.sum ?? '—'}
				tier={getStatTier()}
				sublabel="points total"
				icon="CirclePlus"
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
				tier={getStatTier()}
				sublabel="completions"
				icon="Trophy"
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
				tier={getStatTier()}
				sublabel="completion rate"
				icon="Percent"
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
				tier={getStatTier()}
				label={`${avgPlaytime} h`}
				sublabel="avg completion time"
				icon="Clock"
			/>
		</StyledGameProfileStats>
	);
};

const StyledGameProfileStats = styled(Flex)`
	justify-content: space-evenly;
	gap: var(--size-16);
	padding: var(--size-24) 0 var(--size-32) 0;
	@media (max-width: ${media.tablets}) {
		flex-wrap: wrap;
	}
`;
