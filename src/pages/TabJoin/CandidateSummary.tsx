import { useMemo } from 'react';
import styled from 'styled-components';

import { useCandidateSummary, useTiers } from 'sdk';
import { StatBlock } from 'containers';
import {
	ErrorFallback,
	Flex,
	IconType,
	Loader,
	QueryBoundary,
} from 'components';
import { ColorMap } from 'utils';
import { ColorTokens, useTheme } from 'styles';
import { CandidateHeader } from './CandidateHeader';
import { CandidateVerdict } from './CandidateVerdict';
import { CandidateTable } from 'pages/TabJoin/CandidateTable';

type Props = {
	steamUrl: string;
};

export const CandidateSummary = ({ steamUrl }: Props) => {
	if (!steamUrl.length) return null;
	return (
		<QueryBoundary
			fallback={
				<Loader title="This might take a few minutes - you can leave that page and come back later" />
			}
			errorFallback={<ErrorFallback />}>
			<CandidateSummaryBoundary steamUrl={steamUrl} />
		</QueryBoundary>
	);
};

const CandidateSummaryBoundary = ({ steamUrl }: Pick<Props, 'steamUrl'>) => {
	const { colorTokens } = useTheme();
	const { candidateData } = useCandidateSummary(steamUrl);
	const { tiersData } = useTiers();

	const pointsSum = candidateData?.games.reduce(
		(sum, curr) => sum + curr.pts,
		0,
	);
	const isEligible = (pointsSum ?? 0) >= 20;
	const tiersSum = tiersData.map(tier => ({
		tier: tier.id,
		icon: tier.icon,
		pts: candidateData?.games.reduce(
			(sum, curr) => (curr.tier === tier.id ? sum + curr.pts : sum),
			0,
		),
	}));

	const groupedTierPoints = useMemo(
		() => (
			<Flex row gap={8} justify flexWrap="wrap">
				{Object.values(tiersSum).map(tier => (
					<StatBlock
						sublabel="points in tier"
						label={tier.pts ?? 0}
						icon={tier.icon as IconType}
					/>
				))}
			</Flex>
		),
		[tiersSum],
	);

	if (!candidateData) return null;
	return (
		<StyledCandidateSummary isEligible={isEligible} colorTokens={colorTokens}>
			<CandidateVerdict candidate={candidateData} />
			<Flex column gap={16} padding={'var(--size-16)'}>
				<CandidateHeader candidate={candidateData} />
				{groupedTierPoints}
				<CandidateTable candidate={candidateData} />
			</Flex>
		</StyledCandidateSummary>
	);
};

const StyledCandidateSummary = styled.div<{
	isEligible: boolean;
	colorTokens: ColorTokens;
}>`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background-color: ${({ colorTokens }) =>
		colorTokens['semantic-color--idle']}99;
	border-radius: var(--size-10);
	border: 1px solid
		${({ isEligible, colorTokens }) =>
			isEligible
				? colorTokens[`semantic-color--${ColorMap.SUCCESS}`]
				: colorTokens[`semantic-color--${ColorMap.ERROR}`]}; ;
`;
