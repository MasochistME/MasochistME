import styled from 'styled-components';
import { useMemo } from 'react';

import { useCandidateSummary, useTiers } from 'sdk';
import {
	ErrorFallback,
	Flex,
	Icon,
	IconType,
	Loader,
	QueryBoundary,
	Size,
} from 'components';

type Props = {
	steamName: string;
};
export const CandidateSummary = ({ steamName }: Props) => (
	<QueryBoundary
		fallback={<CandidateSummaryLoader />}
		errorFallback={<ErrorFallback />}>
		<CandidateSummaryBoundary steamName={steamName} />
	</QueryBoundary>
);

const CandidateSummaryBoundary = ({ steamName }: Props) => {
	const { data = [] } = useCandidateSummary(steamName);
	const { tiersData } = useTiers();

	const pointsSum = data?.reduce((sum, curr) => sum + curr.pts, 0);
	const tiersSum = tiersData.map(tier => ({
		tier: tier.id,
		icon: tier.icon,
		pts: data.reduce(
			(sum, curr) => (curr.tier === tier.id ? sum + curr.pts : sum),
			0,
		),
	}));

	const groupedTierPoints = useMemo(() => {
		return Object.values(tiersSum).map(tier => {
			return (
				<StyledScore>
					<Icon icon={tier.icon as IconType} size={Size.MICRO} />
					{tier?.pts}
				</StyledScore>
			);
		});
	}, [tiersSum]);

	if (!data) return null;
	return (
		<Flex>
			<div>{pointsSum} pts</div>
			{groupedTierPoints}
		</Flex>
	);
};

const CandidateSummaryLoader = () => {
	return (
		<>
			<Loader />
			<div>This might take a few minutes - do not leave this page...</div>
		</>
	);
};

const StyledScore = styled(Flex)`
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
	width: 20px;

	i {
		margin: 0;
		padding: 0;
	}
`;
