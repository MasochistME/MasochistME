import React from 'react';
import styled from 'styled-components';
import { RaceType } from '@masochistme/sdk/dist/v1/types';

import { useRaceById } from 'sdk';
import { Flex, Icon, Size, Spinner } from 'components';
import { getRaceTypeIcon } from 'utils';

type Props = {
	raceId?: string | null;
};

export const ModalRaceHeader = (props: Props) => {
	const { raceId } = props;
	const { raceData: race } = useRaceById(raceId);
	if (!race) return <Spinner />;

	const icon = getRaceTypeIcon(race);
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
			<Flex align width="100%" justifyContent="space-around">
				<Flex column align>
					<span style={{ fontWeight: 600 }}>Download grace time</span>
					{race.downloadGrace}s
				</Flex>
				<Flex column align>
					<span style={{ fontWeight: 600 }}>Proof upload grace time:</span>
					{race.uploadGrace}s
				</Flex>
			</Flex>
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
