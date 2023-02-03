import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Game, Badge } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useGameBadges } from 'sdk';
import { Flex, Spinner, Warning } from 'components';
import { SubPage, Section, BadgeTile, Tabs, Tab, TabPanel } from 'containers';
import { useActiveTab, useMixpanel } from 'hooks';
import { TabDict } from 'configuration/tabs';

import { GameProfileHeader } from './GameProfileHeader';
import { GameProfileLeaderboards } from './GameProfileLeaderboards';
import { GameProfileFeatured } from './GameProfileFeatured';
// import { GameProfileGraphs } from './GameProfileGraphs';
// import { GameProfileBadges } from './GameProfileBadges';
import { GameProfileStats } from './GameProfileStats';

enum TabsMap {
	LEADERBOARDS = 'leaderboards',
	FEATURED = 'featured',
	GRAPHS = 'graphs',
	BADGES = 'badges',
}

const TabGame = (): JSX.Element => {
	useActiveTab(TabDict.GAME, true);
	const [activeTab, setActiveTab] = useState<string>(TabsMap.LEADERBOARDS);
	const { track } = useMixpanel();
	const { id } = useParams<{ id: string }>();
	const gameId = Number(id);

	useEffect(() => {
		track('tab.game.visit', { id });
	}, []);

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
		track('page.game.tab', { tab: newTab });
	};

	if (!game)
		return (
			<SubPage>
				<Warning description={`Game with id ${id} does not exist.`} />
			</SubPage>
		);

	return (
		<SubPage>
			<Flex column width="100%" gap={16}>
				<Flex column>
					<GameProfileHeader game={game} />
					<GameProfileStats game={game} />
				</Flex>
				<StyledGameStats>
					{!isGamesLoading && isGamesFetched && (
						<>
							<Tabs value={activeTab} onChange={handleChangeTab}>
								<Tab label="Leaderboards" value={TabsMap.LEADERBOARDS} />
								<Tab label="Featured content" value={TabsMap.FEATURED} />
								{/* <Tab label="Badges" value={TabsMap.BADGES} /> */}
								{/* <Tab label="Graphs" value={TabsMap.GRAPHS} /> */}
							</Tabs>
							<TabPanel activeTab={activeTab} tabId={TabsMap.LEADERBOARDS}>
								<GameProfileLeaderboards gameId={gameId} />
							</TabPanel>
							<TabPanel activeTab={activeTab} tabId={TabsMap.FEATURED}>
								<GameProfileFeatured gameId={gameId} />
							</TabPanel>
							{/* 
							<TabPanel activeTab={activeTab} tabId={TabsMap.GRAPHS}>
								<GameProfileGraphs gameId={gameId} title={game.title} />
							</TabPanel>
							<TabPanel activeTab={activeTab} tabId={TabsMap.BADGES}>
								<GameProfileBadges gameId={gameId} />
							</TabPanel> */}
						</>
					)}
				</StyledGameStats>
			</Flex>
			<Section
				width="100%"
				maxWidth="450px"
				title="Badges"
				content={
					<StyledGameProfileBadges>
						{isGameBadgesLoading && <Spinner />}
						{isGameBadgesFetched && gameBadgesData.length
							? gameBadgesData.map((badge: Badge) => (
									<BadgeTile badge={badge} key={`badge-${badge._id}`} />
							  ))
							: 'This game has no badges yet.'}
					</StyledGameProfileBadges>
				}
			/>
		</SubPage>
	);
};

export default TabGame;

const StyledGameStats = styled.div`
	max-width: 1000px;
	width: 100%;
	flex: 1 1 100%;
	overflow: hidden;
`;

const StyledGameProfileBadges = styled(Flex)`
	gap: 8px;
	width: 100%;
	flex-flow: row wrap;
`;
