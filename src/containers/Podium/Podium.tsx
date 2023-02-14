import { RacePlayer } from '@masochistme/sdk/dist/v1/types';
import styled from 'styled-components';

import { PodiumItem } from './PodiumItem';

type Props = {
	podium: (RacePlayer & { place: 1 | 2 | 3 })[];
};

export const Podium = (props: Props) => {
	const { podium } = props;
	return (
		<StyledPodium>
			{podium.map(player => (
				<PodiumItem player={player} />
			))}
		</StyledPodium>
	);
};

Podium.Skeleton = () => {
	const podium: (1 | 2 | 3)[] = [1, 2, 3];
	return (
		<StyledPodium>
			{podium.map(() => (
				<PodiumItem.Skeleton />
			))}
		</StyledPodium>
	);
};

const StyledPodium = styled.div`
	display: grid;
	align-items: center;
	grid-template-columns: 3fr 1;
	padding: 0 32px;
	height: 300px;
`;
