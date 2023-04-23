import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { dedupArray, stringCompare } from 'utils';
import { useBadges, useCuratedGames, useTiers } from 'sdk';
import {
	ErrorFallback,
	Flex,
	Icon,
	IconType,
	QueryBoundary,
	Skeleton,
} from 'components';
import { BadgeTile, Section } from 'containers';

export const BadgesTileView = () => (
	<QueryBoundary
		fallback={<BadgesTileViewSkeleton />}
		errorFallback={<ErrorFallback />}>
		<BadgesTileViewBoundary />
	</QueryBoundary>
);

const BadgesTileViewBoundary = () => {
	const { gamesData: games } = useCuratedGames();
	const { badgesData } = useBadges({ sort: { points: 'desc' } });
	const { tiersData } = useTiers();

	const gamesWithBadgesIds = badgesData
		.map(badge => badge.gameId ?? badge.title)
		.filter(dedupArray);

	const badgesByGames = gamesWithBadgesIds
		.map(gameId => {
			const game = games.find(game => game.id === gameId);
			return {
				gameId,
				gameTier: game?.tier,
				gameTitle: game?.title ?? String(gameId),
			};
		})
		.sort((gameA, gameB) =>
			stringCompare(gameA.gameTitle as string, gameB.gameTitle as string),
		)
		.map(game => {
			const gameBadges = badgesData.map(badge => {
				if (badge.title === game.gameTitle || badge.gameId === game.gameId)
					return <BadgeTile badge={badge} key={`badge-${badge._id}`} />;
			});
			const tierIcon = (tiersData.find(tier => tier.id === game.gameTier)
				?.icon ?? 'QuestionCircle') as IconType;

			return (
				<Section
					width="35rem"
					maxWidth="100%"
					key={`game-${game.gameId}-badges`}
					anchorId={String(game.gameId)}
					title={
						<StyledBadgeTitle>
							<Icon icon={tierIcon} />
							<Link to={`/game/${game.gameId}`}>{game.gameTitle}</Link>
						</StyledBadgeTitle>
					}
					content={
						<Flex column gap={8}>
							{gameBadges}
						</Flex>
					}
				/>
			);
		});

	return <StyledBadgesList>{badgesByGames}</StyledBadgesList>;
};

const BadgesTileViewSkeleton = () => (
	<StyledBadgesList>
		{new Array(9).fill(null).map(() => (
			<Section
				maxWidth="100%"
				width="35rem"
				title={
					<Skeleton variant="text" width="10rem" height="var(--size-24)" />
				}
				content={<BadgeTile.Skeleton />}
			/>
		))}
	</StyledBadgesList>
);

const StyledBadgesList = styled(Flex)`
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: center;
	gap: var(--size-16);
	width: 100%;
`;

const StyledBadgeTitle = styled(Flex)`
	align-items: center;
	gap: var(--size-8);
	font-size: var(--font-size-16);
`;
