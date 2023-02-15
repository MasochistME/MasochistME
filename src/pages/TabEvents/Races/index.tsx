import styled from 'styled-components';

import { ErrorFallback, Flex, QueryBoundary, Loader } from 'components';
import { Section, SectionProps } from 'containers';

import { SingleSeason } from './SingleSeason';
import { useRacesFromSeason } from 'hooks';
import { SeasonSelect } from './SeasonSelect';
import { useState } from 'react';

export const RacesPage = (): JSX.Element => {
	const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
	return (
		<StyledWrapper>
			<Flex column width="100%" gap={16}>
				<SeasonSelect
					selectedSeasonId={selectedSeasonId}
					setSelectedSeasonId={setSelectedSeasonId}
				/>
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<SeasonBoundary selectedSeasonId={selectedSeasonId} />
				</QueryBoundary>
			</Flex>
			<RacesInfo isDesktopOnly width="100%" maxWidth="450px" />
		</StyledWrapper>
	);
};

type Props = {
	selectedSeasonId: string | null;
};
const SeasonBoundary = ({ selectedSeasonId }: Props) => {
	const { season, races } = useRacesFromSeason(selectedSeasonId);
	return <SingleSeason season={season} races={races} />;
};

const RacesInfo = (props: Partial<SectionProps>): JSX.Element => {
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
					<ul style={{ margin: 0, paddingLeft: '24px', textAlign: 'left' }}>
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

const StyledWrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: flex-start;
	width: 100%;
	gap: 16px;
`;
