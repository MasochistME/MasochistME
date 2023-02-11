import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { FilterBar, Flex, Icon, Select } from 'components';
import { Section, SectionProps, SubPage } from 'containers';

import { SingleSeason } from './SingleSeason';
import { useRaces, useSeasons } from 'sdk';
import { media } from 'styles';

export const TabRaces = (): JSX.Element => {
	useActiveTab(TabDict.EVENTS);
	const { seasonsData } = useSeasons({ sort: { startDate: 'desc' } });
	const [selectedSeason, setSelectedSeason] = useState<string>('');

	const season = useMemo(() => {
		return seasonsData.find(season => String(season._id) === selectedSeason);
	}, [selectedSeason]);

	const { racesData } = useRaces({
		filter: { season: selectedSeason, isDone: true },
	});

	const optionsSeasonsActive = seasonsData
		.filter(season => !season.endDate)
		.map(season => ({
			render: (
				<StyledOption>
					<Icon icon="HourglassHalf" /> {season.name}
				</StyledOption>
			),
			value: String(season._id),
			isSubheader: false,
		}));

	const optionsSeasonsDone = seasonsData
		.filter(season => season.endDate)
		.map(season => ({
			render: (
				<StyledOption>
					<Icon icon="CalendarCheck" /> {season.name}
				</StyledOption>
			),
			value: String(season._id),
			isSubheader: false,
		}));

	const options = [
		{ value: 'Active seasons', isSubheader: true },
		...optionsSeasonsActive,
		{ value: 'Past seasons', isSubheader: true },
		...optionsSeasonsDone,
	];

	return (
		<SubPage>
			<StyledSeasonsList>
				<FilterBar>
					<div />
					<SelectWrapper>
						<Select
							options={options}
							defaultSelection={optionsSeasonsActive[0]?.value ?? undefined}
							selectedOption={selectedSeason}
							setSelectedOption={setSelectedSeason}
							placeholder="Select season..."
						/>
					</SelectWrapper>
				</FilterBar>
				<SingleSeason season={season} races={racesData} />
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

const StyledOption = styled(Flex)`
	align-items: center;
	gap: 8px;
`;

const SelectWrapper = styled(Flex)`
	width: 50%;
	@media (max-width: ${media.smallNetbooks}) {
		width: 100%;
	}
`;
