import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Game, Badge } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useGameBadges } from 'sdk';
import { Flex, Spinner, Warning } from 'components';
import { SubPage, Section, BadgeTile, Tabs, Tab, TabPanel } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { GameProfileHeader } from './GameProfileHeader';
import { GameProfileGraphs } from './GameProfileGraphs';
import { GameProfileBadges } from './GameProfileBadges';
import { GameProfileLeaderboards } from './GameProfileLeaderboards';

enum TabsMap {
	GRAPHS = 'graphs',
	BADGES = 'badges',
	MEMBERS = 'members',
}

const TabGame = (): JSX.Element => {
	useActiveTab(TabDict.GAME);
	const [activeTab, setActiveTab] = useState<string>(TabsMap.MEMBERS);
	const { id } = useParams<{ id: string }>();
	const gameId = Number(id);

	const {
		gamesData,
		isLoading: isGamesLoading,
		isFetched: isGamesFetched,
	} = useCuratedGames();
	const {
		gameBadgesData = [],
		isLoading: isGameBadgesLoading,
		isFetched: isGameBadgesFetched,
	} = useGameBadges(gameId);

	const game = gamesData.find((g: Game) => g.id === gameId);

	const handleChangeTab = (_e: React.SyntheticEvent, newTab: TabsMap) => {
		setActiveTab(newTab);
	};

	if (!game)
		return (
			<SubPage>
				<Warning description={`Game with id ${id} does not exist.`} />
			</SubPage>
		);

	return (
		<SubPage>
			<Flex column width="100%">
				<GameProfileHeader game={game} />
				<StyledGameStats>
					{isGamesFetched && (
						<>
							<Tabs value={activeTab} onChange={handleChangeTab}>
								<Tab label="Leaderboards" value={TabsMap.MEMBERS} />
								<Tab label="Badges" value={TabsMap.BADGES} />
								<Tab label="Graphs" value={TabsMap.GRAPHS} />
							</Tabs>
							<TabPanel activeTab={activeTab} tabId={TabsMap.MEMBERS}>
								<GameProfileLeaderboards gameId={gameId} />
							</TabPanel>
							<TabPanel activeTab={activeTab} tabId={TabsMap.BADGES}>
								<GameProfileBadges gameId={gameId} />
							</TabPanel>
							<TabPanel activeTab={activeTab} tabId={TabsMap.GRAPHS}>
								<GameProfileGraphs gameId={gameId} title={game.title} />
							</TabPanel>
						</>
					)}
				</StyledGameStats>
			</Flex>
			<Section
				minWidth="450px"
				maxWidth="450px"
				title="Badges"
				content={
					<Flex column gap={4}>
						{isGameBadgesLoading && <Spinner />}
						{isGameBadgesFetched && gameBadgesData.length
							? gameBadgesData.map((badge: Badge) => (
									<BadgeTile badge={badge} key={`badge-${badge._id}`} />
							  ))
							: 'This game has no badges yet.'}
					</Flex>
				}
			/>
		</SubPage>
	);
};

export default TabGame;

const StyledGameStats = styled.div`
	width: 100%;
	flex: 1 1 100%;
`;
