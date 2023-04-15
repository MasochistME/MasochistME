import React from 'react';
import styled from 'styled-components';

import { Section } from 'containers';
import { Flex, Icon, Size } from 'components';

import { GraphHoursPlayedTotal } from './GraphHoursPlayedTotal';
import { GraphHoursPlayedCompleted } from './GraphHoursPlayedCompleted';
import { GraphGamesCompleted } from './GraphGamesCompleted';
// import { GraphCompletionTimeline } from './GraphCompletionTimeline';

type Props = {
	memberId: string;
};

export const MemberProfileGraphs = (props: Props): JSX.Element | null => {
	const { memberId } = props;

	return (
		<Flex justify flexWrap="wrap" width="100%" gap={16}>
			<Section
				minWidth="25rem"
				maxWidth="25rem"
				title={
					<StyledGraphTitle>
						<span>Playtime total [h]</span>
						<Icon
							size={Size.MICRO}
							icon="QuestionCircle"
							hoverText={`Total number of hours this member spent playing games from specified tiers`}
						/>
					</StyledGraphTitle>
				}
				content={<GraphHoursPlayedTotal memberId={memberId} />}
			/>
			<Section
				minWidth="25rem"
				maxWidth="25rem"
				title={
					<StyledGraphTitle>
						<span>Playtime completed [h]</span>
						<Icon
							size={Size.MICRO}
							icon="CircleInfo"
							hoverText="Total number of hours this member spent completing games from specified tiers"
						/>
					</StyledGraphTitle>
				}
				content={<GraphHoursPlayedCompleted memberId={memberId} />}
			/>
			<Section
				minWidth="25rem"
				maxWidth="25rem"
				title={
					<StyledGraphTitle>
						<span>Games completed</span>
						<Icon
							size={Size.MICRO}
							icon="CircleInfo"
							hoverText="Total number of games from specified tiers that this member completed"
						/>
					</StyledGraphTitle>
				}
				content={<GraphGamesCompleted memberId={memberId} />}
			/>
			{/* <Section
				fullWidth
				title="Completion timeline"
				content={<GraphCompletionTimeline memberId={memberId} />}
			/> */}
		</Flex>
	);
};

const StyledGraphTitle = styled.div`
	display: flex;
	align-items: center;
	gap: var(--size-8);
	font-size: var(--font-size-16);
`;
