import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { dedupArray, stringCompare } from 'utils';
import { useActiveTab } from 'hooks';
import { useBadges, useCuratedGames, useTiers } from 'sdk';
import { TabDict } from 'configuration/tabs';
import { Flex, Icon, IconType } from 'components';
import { SubPage, BadgeTile, Section } from 'containers';

const TabBadges = (): JSX.Element => {
	useActiveTab(TabDict.BADGES);

	const { gamesData: games } = useCuratedGames();
	const { badgesData } = useBadges({ sort: { points: 'desc' } });
	const { tiersData } = useTiers();

	const gamesWithBadgesIds = badgesData
		.map(badge => badge.gameId ?? badge.title)
		.filter(dedupArray);
	// .map(gameId => )

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
					maxWidth="100%"
					width="450px"
					key={`game-${game.gameId}-badges`}
					title={
						<Flex align gap={8}>
							<Icon icon={tierIcon} />
							<Link to={`/game/${game.gameId}`}>{game.gameTitle}</Link>
						</Flex>
					}
					content={
						<Flex column gap={8}>
							{gameBadges}
						</Flex>
					}
				/>
			);
		});

	return (
		<SubPage>
			<StyledBadgesList>{badgesByGames}</StyledBadgesList>
		</SubPage>
	);
};

export default TabBadges;

const StyledBadgesList = styled(Flex)`
	flex-wrap: wrap;
	align-items: flex-start;
	gap: 16px;
	width: 100%;
`;
