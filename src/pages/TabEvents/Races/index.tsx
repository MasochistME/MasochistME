import styled from 'styled-components';

import {
	ErrorFallback,
	Flex,
	QueryBoundary,
	Loader,
	Icon,
	Warning,
} from 'components';
import { Section, SectionProps } from 'containers';

import { SingleSeason } from './SingleSeason';
import { useRacesFromSeason } from 'hooks';
import { SeasonSelect } from './SeasonSelect';
import { useState } from 'react';

export const RacesPage = (): JSX.Element => {
	const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
	return (
		<StyledWrapper>
			<Flex row width="100%">
				<Flex column width="100%" gap={16}>
					<SeasonSelect
						selectedSeasonId={selectedSeasonId}
						setSelectedSeasonId={setSelectedSeasonId}
					/>
					<QueryBoundary
						fallback={<Loader />}
						errorFallback={<ErrorFallback />}>
						<SeasonBoundary selectedSeasonId={selectedSeasonId} />
					</QueryBoundary>
				</Flex>
				<Flex column gap={16}>
					<RacesInfoBasic isDesktopOnly width="100%" maxWidth="45rem" />
					<RacesInfoPoints isDesktopOnly width="100%" maxWidth="45rem" />
					<RacesInfoJoin isDesktopOnly width="100%" maxWidth="45rem" />
				</Flex>
			</Flex>
			<Flex justify alignItems="flex-start" flexWrap="wrap" gap={16}>
				<RacesInfoBasic isMobileOnly width="30%" minWidth="30rem" />
				<RacesInfoPoints isMobileOnly width="30%" minWidth="30rem" />
				<RacesInfoJoin isMobileOnly width="30%" minWidth="30rem" />
			</Flex>
		</StyledWrapper>
	);
};

type Props = {
	selectedSeasonId: string | null;
};
const SeasonBoundary = ({ selectedSeasonId }: Props) => {
	const { season, races } = useRacesFromSeason(selectedSeasonId);
	if (selectedSeasonId === null)
		return (
			<Warning description="There is no seasons active at the moment. Select one of the past races from the dropdown above." />
		);
	return <SingleSeason season={season} races={races} />;
};

const RacesInfoBasic = (props: Partial<SectionProps>): JSX.Element => {
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
					<div>There are two types of races:</div>
					<ul
						style={{
							margin: 0,
							paddingLeft: 'var(--size-24)',
							textAlign: 'left',
						}}>
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
						races and takes into consideration 7 best results of all
						participants. The lower final season score you have, the higher you
						are placed.
					</div>
				</Flex>
			}
		/>
	);
};

const RacesInfoPoints = (props: Partial<SectionProps>): JSX.Element => {
	return (
		<Section
			{...props}
			title="Point system"
			content={
				<Flex column gap={8}>
					<div>
						When you participate in a race, your final points for this
						particular race equal{' '}
						<span style={{ fontWeight: 'bold' }}>your place minus 1</span>.
					</div>
					<div>
						If you got disqualified, DNF'd or did not participate in a race at
						all, your final points will be equal to{' '}
						<span style={{ fontWeight: 'bold' }}>
							number of participants who finished the race
						</span>
						.
					</div>
					<div>
						The <span style={{ fontWeight: 'bold' }}>less</span> points you have
						in the season, the{' '}
						<span style={{ fontWeight: 'bold' }}>higher</span> you are placed.
					</div>
				</Flex>
			}
		/>
	);
};

const RacesInfoJoin = (props: Partial<SectionProps>): JSX.Element => {
	return (
		<Section
			{...props}
			title="How to participate"
			content={
				<Flex column gap={8}>
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
							<Flex align gap={8}>
								How to join and participate <Icon icon="ExternalLink" />
							</Flex>
						</a>
					</div>
				</Flex>
			}
		/>
	);
};

const StyledWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	align-items: flex-start;
	width: 100%;
	gap: var(--size-16);
`;
