import { RacePlayer } from '@masochistme/sdk/dist/v1/types';
import styled from 'styled-components';
import { media } from 'styles';

import { PodiumItem } from './PodiumItem';

type Props = {
	podium: RacePlayer[];
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
	padding: 0 var(--size-32);
	height: 30rem;

	@media (max-width: ${media.tablets}) {
		padding: 0 var(--size-8);
	}
`;
