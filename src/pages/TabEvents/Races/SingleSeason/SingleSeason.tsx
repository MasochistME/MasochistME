import { useState } from 'react';
import styled from 'styled-components';
import { RaceWithSummary, Season } from '@masochistme/sdk/dist/v1/types';

import { ErrorFallback, Flex } from 'components';
import { StatBlock, Tabs, Tab, TabPanel } from 'containers';
import { getHumanReadableDate } from 'utils';

import { SingleSeasonRanking } from './SingleSeasonRanking';
import { SingleSeasonRaces } from './SingleSeasonRaces';
import { ColorTokens, useTheme } from 'styles';
import { useMixpanel } from 'hooks';

enum TabsSeasonDetails {
	RANKING = 'ranking',
	RACES = 'races',
}

type SingleSeasonProps = {
	season?: Season | null;
	races: RaceWithSummary[];
};

export const SingleSeason = (props: SingleSeasonProps) => {
	const { season, races } = props;
	const { track } = useMixpanel();
	const { colorTokens } = useTheme();
	const [activeTab, setActiveTab] = useState<TabsSeasonDetails>(
		TabsSeasonDetails.RANKING,
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
		track('races.tab.change', { tab: newTab });
	};

	// TODO This shows error fallback component for a split second
	// after the query boundary loads and before season loads
	// fix pls
	if (!season) return <ErrorFallback />;
	return (
		<StyledSeasonWrapper column>
			<StyledRacesTop colorTokens={colorTokens}>
				<div>{season.description}</div>
				<Flex align justifyContent="space-evenly" flexWrap="wrap" gap={16}>
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
			</StyledRacesTop>
			<StyledRacesList>
				<Tabs value={activeTab} onChange={handleChangeTab}>
					<Tab label="Ranking" value={TabsSeasonDetails.RANKING} />
					<Tab label="Races" value={TabsSeasonDetails.RACES} />
				</Tabs>
				<TabPanel activeTab={activeTab} tabId={TabsSeasonDetails.RANKING}>
					<SingleSeasonRanking seasonId={String(season._id)} />
				</TabPanel>
				<TabPanel activeTab={activeTab} tabId={TabsSeasonDetails.RACES}>
					<SingleSeasonRaces races={races} />
				</TabPanel>
			</StyledRacesList>
		</StyledSeasonWrapper>
	);
};

const StyledSeasonWrapper = styled(Flex)`
	gap: var(--size-16);
	width: 100%;
`;

const StyledRacesTop = styled(Flex)<{
	colorTokens: ColorTokens;
}>`
	flex-direction: column;
	background-color: ${({ colorTokens }) => colorTokens['core-tertiary-bg']}cc;
	border-radius: var(--border-radius-16);
	padding: var(--size-16);
	gap: var(--size-16);
`;

const StyledRacesList = styled(Flex)`
	flex-direction: column;
	flex: 1 1 100%;
`;
