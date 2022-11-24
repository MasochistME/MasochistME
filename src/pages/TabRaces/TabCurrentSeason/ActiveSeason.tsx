import { useState } from 'react';
import styled from 'styled-components';
import { Race, Season } from '@masochistme/sdk/dist/v1/types';

import { Flex, Skeleton } from 'components';
import { StatBlock, Tabs, Tab, TabPanel } from 'containers';
import { getHumanReadableDate } from 'utils';

import { ActiveSeasonRanking } from './ActiveSeasonRanking';
import { ActiveSeasonRaces } from './ActiveSeasonRaces';

enum TabsSeasonDetails {
	RANKING = 'ranking',
	RACES = 'races',
}

type ActiveSeasonProps = {
	season: Season;
	races: Race[];
	isLoading: boolean;
};

export const ActiveSeason = (props: ActiveSeasonProps) => {
	const { season, races, isLoading } = props;
	const [activeTab, setActiveTab] = useState<TabsSeasonDetails>(
		TabsSeasonDetails.RANKING,
	);

	const handleChangeTab = (
		_e: React.SyntheticEvent,
		newTab: TabsSeasonDetails,
	) => {
		setActiveTab(newTab);
	};

	return (
		<Flex column gap={16}>
			<StyledSeasonTitle>
				{isLoading ? <Skeleton width="300px" /> : season.name}
			</StyledSeasonTitle>
			{isLoading ? <Skeleton width="100%" /> : <div>{season.description}</div>}
			<Flex align justifyContent="space-evenly" gap={16}>
				<StatBlock
					label={races.length ?? '—'}
					sublabel="races total"
					title={<StatBlock.Title>Races total</StatBlock.Title>}
					icon="Finish"
					isLoading={isLoading}
				/>
				<StatBlock
					label={getHumanReadableDate(season.startDate)}
					sublabel="season start date"
					title={<StatBlock.Title>Season start date</StatBlock.Title>}
					icon="Finish"
					isLoading={isLoading}
				/>
				<StatBlock
					label={getHumanReadableDate(season.endDate)}
					sublabel="season end date"
					title={<StatBlock.Title>Season end date</StatBlock.Title>}
					icon="Finish"
					isLoading={isLoading}
				/>
				<StatBlock
					label="—"
					sublabel="unique participants"
					title={<StatBlock.Title>Unique participants</StatBlock.Title>}
					icon="Finish"
					isLoading={isLoading}
				/>
			</Flex>
			<StyledRacesList>
				<Tabs value={activeTab} onChange={handleChangeTab}>
					<Tab label="Ranking" value={TabsSeasonDetails.RANKING} />
					<Tab label="Races" value={TabsSeasonDetails.RACES} />
				</Tabs>
				<TabPanel activeTab={activeTab} tabId={TabsSeasonDetails.RANKING}>
					<ActiveSeasonRanking />
				</TabPanel>
				<TabPanel activeTab={activeTab} tabId={TabsSeasonDetails.RACES}>
					<ActiveSeasonRaces races={races} />
				</TabPanel>
			</StyledRacesList>
		</Flex>
	);
};

const StyledSeasonTitle = styled.h2`
	display: flex;
	margin: 0;
	align-items: center;
	font-size: 24px;
`;
const StyledRacesList = styled(Flex)`
	flex-direction: column;
	flex: 1 1 100%;
`;
