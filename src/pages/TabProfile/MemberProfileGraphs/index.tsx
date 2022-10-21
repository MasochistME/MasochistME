import React from 'react';

import { Section } from 'containers';
import { Flex } from 'components';

import { GraphHoursPlayedTotal } from './GraphHoursPlayedTotal';
import { GraphHoursPlayedCompleted } from './GraphHoursPlayedCompleted';
// import { GraphGamesCompleted } from './GraphGamesCompleted';
// import { GraphCompletionTimeline } from './GraphCompletionTimeline';

type Props = {
	memberId: string;
};

export const MemberProfileGraphs = (props: Props): JSX.Element | null => {
	const { memberId } = props;

	return (
		<Flex justify flexWrap="wrap" width="100%" gap={16}>
			<Section
				minWidth="300px"
				maxWidth="300px"
				title="Hour played (total)"
				content={<GraphHoursPlayedTotal memberId={memberId} />}
			/>
			<Section
				title="Hours played (completed)"
				minWidth="300px"
				maxWidth="300px"
				content={<GraphHoursPlayedCompleted memberId={memberId} />}
			/>
			{/* <Section
				minWidth="300px"
				maxWidth="300px"
				title="Games completed"
				content={<GraphGamesCompleted memberId={memberId} />}
			/>
			<Section
				fullWidth
				title="Completion timeline"
				content={<GraphCompletionTimeline memberId={memberId} />}
			/> */}
		</Flex>
	);
};
