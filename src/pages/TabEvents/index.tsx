import React, { useState } from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Flex } from 'components';
import {
	Section,
	SectionProps,
	SubPage,
	Tabs,
	Tab,
	TabPanel,
} from 'containers';

import { TabCurrentSeason } from './TabCurrentSeason';
import { TabPastSeasons } from './TabPastSeasons';
import { TabRacesMore } from './TabRacesMore';

enum TabsSeasons {
	CURRENT_SEASONS = 'current_seasons',
	PAST_SEASONS = 'past_seasons',
	MORE = 'more',
}

export const TabRaces = (): JSX.Element => {
	useActiveTab(TabDict.EVENTS);

	const [activeTab, setActiveTab] = useState<TabsSeasons>(
		TabsSeasons.CURRENT_SEASONS,
	);

	const handleChangeTab = (_e: React.SyntheticEvent, newTab: TabsSeasons) => {
		setActiveTab(newTab);
	};

	return (
		<SubPage>
			<StyledSeasonsList>
				<Tabs value={activeTab} onChange={handleChangeTab}>
					<Tab label="Current seasons" value={TabsSeasons.CURRENT_SEASONS} />
					<Tab label="Past seasons" value={TabsSeasons.PAST_SEASONS} />
					<Tab label="More" value={TabsSeasons.MORE} />
				</Tabs>
				<TabPanel activeTab={activeTab} tabId={TabsSeasons.CURRENT_SEASONS}>
					<TabCurrentSeason />
				</TabPanel>
				<TabPanel activeTab={activeTab} tabId={TabsSeasons.PAST_SEASONS}>
					<TabPastSeasons />
				</TabPanel>
				<TabPanel activeTab={activeTab} tabId={TabsSeasons.MORE}>
					<TabRacesMore />
				</TabPanel>
			</StyledSeasonsList>
			<Flex column width="100%" maxWidth="450px" gap={16}>
				<TabRaceInfo isDesktopOnly width="100%" maxWidth="450px" />
			</Flex>
		</SubPage>
	);
};

const TabRaceInfo = (props: Partial<SectionProps>): JSX.Element => {
	return (
		<Section
			{...props}
			title="Races"
			content={
				<Flex column gap={8}>
					<div>
						Races are community events (usually happening over the weekend),
						where you have to blindly complete a short secret game and get the
						best possible score.
					</div>
					<div> There are two types of races:</div>
					<ul>
						<li>
							<span style={{ fontWeight: 600 }}>time based</span> - you have to
							complete the game in the shortest time possible,
						</li>
						<li>
							<span style={{ fontWeight: 600 }}>score based</span> - you have to
							get the highest score within a limited time frame.
						</li>
					</ul>
					<div>
						Races are organized into seasons. A season typically consists of 10
						races and takes into consideration 8 best results of all
						participants.
					</div>
					<div>
						Races take place in{' '}
						<a href="https://discord.com/invite/NjAeT53kVb" target="_blank">
							our Discord server
						</a>{' '}
						and require you to be a member of MasochistME community.
					</div>
					<div>
						<a
							href="https://abiding-washer-fc3.notion.site/Races-6fe4971a56194039b85807adf2077262"
							target="_blank">
							This link talks about joining and participating in more detail
						</a>
						.
					</div>
				</Flex>
			}
		/>
	);
};

const StyledSeasonsList = styled(Flex)`
	flex-direction: column;
	flex: 1 1 100%;
	width: 100%;
`;
