import React, { useState } from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Flex, Spinner } from 'components';
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
	useActiveTab(TabDict.RACES);

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
				<TabNextRaceInfo isDesktopOnly width="100%" maxWidth="450px" />
				<TabSpecialEventInfo isDesktopOnly width="100%" maxWidth="450px" />
			</Flex>
		</SubPage>
	);
};

const TabNextRaceInfo = (props: Partial<SectionProps>): JSX.Element => {
	return (
		<Section
			{...props}
			title="Next race"
			content={
				<Flex column gap={8}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget
					pulvinar lectus, in volutpat nisl. Donec varius dolor a sapien
					hendrerit malesuada. Donec ac dui ac ex feugiat suscipit at a sem. In
					hac habitasse platea dictumst. Morbi a ullamcorper ligula. Vivamus
					suscipit lacinia neque. Ut quis dolor a nunc dignissim consequat. Orci
					varius natoque penatibus et magnis dis parturient montes, nascetur
					ridiculus mus. Sed consequat dui libero, et varius quam consectetur
					sit amet. Aenean sodales non risus in elementum. Interdum et malesuada
					fames ac ante ipsum primis in faucibus. Ut malesuada, neque eget
					gravida elementum, diam massa porttitor nisi, a venenatis nulla neque
					consectetur lacus.
				</Flex>
			}
		/>
	);
};

const TabSpecialEventInfo = (props: Partial<SectionProps>): JSX.Element => {
	return (
		<Section
			{...props}
			title="Special event"
			content={
				<Flex column gap={8}>
					Integer sem arcu, aliquet ut metus ac, mattis lobortis diam. Etiam
					consectetur fringilla velit, quis convallis diam placerat quis. Nam
					quis ante massa. Nam vitae faucibus diam, non mollis arcu. Sed
					feugiat, lorem vel bibendum vestibulum, diam sem lacinia sapien, quis
					maximus ex nisl hendrerit mauris. In est enim, auctor sit amet dapibus
					suscipit, commodo quis enim. Aliquam velit lorem, pharetra ut nibh id,
					sagittis scelerisque magna. Maecenas vitae nisi hendrerit ipsum porta
					bibendum. Quisque eleifend nisi quis lorem sodales, nec viverra metus
					pharetra. Donec sagittis orci sed magna molestie condimentum. Quisque
					id vehicula metus, sed congue leo. Ut vel consectetur risus. Nunc
					aliquet ut purus eu dictum. Curabitur vitae porttitor quam.
				</Flex>
			}
		/>
	);
};

const StyledSeasonsList = styled(Flex)`
	flex-direction: column;
	flex: 1 1 100%;
`;
