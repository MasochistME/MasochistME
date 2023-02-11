import { useState } from 'react';
import styled from 'styled-components';
import { RaceWithSummary, Season } from '@masochistme/sdk/dist/v1/types';

import { ErrorFallback, Flex } from 'components';
import { StatBlock, Tabs, Tab, TabPanel } from 'containers';
import { getHumanReadableDate } from 'utils';

import { SingleSeasonRanking } from './SingleSeasonRanking';
import { SingleSeasonRaces } from './SingleSeasonRaces';

enum TabsSeasonDetails {
	RANKING = 'ranking',
	RACES = 'races',
}

type SingleSeasonProps = {
	season?: Season;
	races: RaceWithSummary[];
};

export const SingleSeason = (props: SingleSeasonProps) => {
	const { season, races } = props;

	const [activeTab, setActiveTab] = useState<TabsSeasonDetails>(
		TabsSeasonDetails.RACES,
	);

	const uniqueParticipants =
		[
			...new Set(
				races
					.map(r => r.summary?.list ?? [])
					.flat()
					.sort(),
			),
		]?.length ?? '—';

	const handleChangeTab = (
		_e: React.SyntheticEvent,
		newTab: TabsSeasonDetails,
	) => {
		setActiveTab(newTab);
	};

	if (!season) return <ErrorFallback />; // TODO something else
	return (
		<StyledSeasonWrapper column>
			<StyledSeasonTitle>{season.name}</StyledSeasonTitle>
			<div>{season.description}</div>
			<Flex align justifyContent="space-evenly" gap={16}>
				<StatBlock
					label={races.length ?? '—'}
					sublabel="races total"
					title={<StatBlock.Title>Races total</StatBlock.Title>}
					icon="Finish"
				/>
				<StatBlock
					label={getHumanReadableDate(season.startDate)}
					sublabel="season start date"
					title={<StatBlock.Title>Season start date</StatBlock.Title>}
					icon="Finish"
				/>
				<StatBlock
					label={getHumanReadableDate(season.endDate)}
					sublabel="season end date"
					title={<StatBlock.Title>Season end date</StatBlock.Title>}
					icon="Finish"
				/>
				<StatBlock
					label={uniqueParticipants}
					sublabel="unique participants"
					title={<StatBlock.Title>Unique participants</StatBlock.Title>}
					icon="Finish"
				/>
			</Flex>
			<StyledRacesList>
				<Tabs value={activeTab} onChange={handleChangeTab}>
					<Tab label="Ranking" value={TabsSeasonDetails.RANKING} />
					<Tab label="Races" value={TabsSeasonDetails.RACES} />
				</Tabs>
				<TabPanel activeTab={activeTab} tabId={TabsSeasonDetails.RANKING}>
					<SingleSeasonRanking />
				</TabPanel>
				<TabPanel activeTab={activeTab} tabId={TabsSeasonDetails.RACES}>
					<SingleSeasonRaces races={races} />
				</TabPanel>
			</StyledRacesList>
		</StyledSeasonWrapper>
	);
};

const StyledSeasonWrapper = styled(Flex)`
	gap: 16px;
	width: 100%;
`;

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
