import React from 'react';

import { Section } from 'containers';
import { Flex, Icon, Tooltip, Size } from 'components';

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
				minWidth="250px"
				maxWidth="250px"
				title={
					<Flex align gap={8}>
						<span>Playtime total [h]</span>
						<Icon
							size={Size.MICRO}
							icon="QuestionCircle"
							hoverText={`Total number of hours this member spent playing games from specified tiers`}
						/>
					</Flex>
				}
				content={<GraphHoursPlayedTotal memberId={memberId} />}
			/>
			<Section
				minWidth="250px"
				maxWidth="250px"
				title={
					<Flex align gap={8}>
						<span>Playtime completed [h]</span>
						<Icon
							size={Size.MICRO}
							icon="CircleInfo"
							hoverText="Total number of hours this member spent completing games from specified tiers"
						/>
					</Flex>
				}
				content={<GraphHoursPlayedCompleted memberId={memberId} />}
			/>
			<Section
				minWidth="250px"
				maxWidth="250px"
				title={
					<Flex align gap={8}>
						<span>Games completed</span>
						<Icon
							size={Size.MICRO}
							icon="CircleInfo"
							hoverText="Total number of games from specified tiers that this member completed"
						/>
					</Flex>
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
