import React from 'react';
import styled from 'styled-components';
import { RaceType } from '@masochistme/sdk/dist/v1/types';

import { useRaceById } from 'sdk';
import { Flex, Icon, Size, Spinner } from 'components';

type Props = {
	raceId?: string | null;
};

export const ModalRaceHeader = (props: Props) => {
	const { raceId } = props;
	const { raceData: race } = useRaceById(raceId);
	if (!race) return <Spinner />;

	const icon = race.type === RaceType.SCORE_BASED ? 'Stopwatch' : 'Gauge';
	const iconTextHover =
		race.type === RaceType.SCORE_BASED ? 'Score based race' : 'Time based race';

	return (
		<StyledModalRaceHeader column>
			<Flex align gap={8}>
				<Icon icon={icon} hoverText={iconTextHover} size={Size.SMALL} />
				<h2>
					<a href={race.downloadLink} target="_blank">
						{race.name.toUpperCase()}
					</a>
				</h2>
			</Flex>
			<p>
				<span style={{ fontWeight: 600 }}>Instructions:</span>{' '}
				{race.instructions}
			</p>
			<p>
				<span style={{ fontWeight: 600 }}>Objectives:</span> {race.objectives}
			</p>
		</StyledModalRaceHeader>
	);
};

const StyledModalRaceHeader = styled(Flex)`
	justify-content: space-between;
	text-align: left;
	gap: 8px;
	p,
	h2 {
		margin: 0;
		padding: 0;
	}
`;
