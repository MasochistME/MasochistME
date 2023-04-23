import styled from 'styled-components';
import { Candidate } from '@masochistme/sdk/dist/v1/types';

import { ColorMap } from 'utils';
import { ColorTokens, useTheme } from 'styles';
import { Flex, Icon, Size } from 'components';

type Props = { candidate: Candidate };

export const CandidateVerdict = ({ candidate }: Props) => {
	const { colorTokens } = useTheme();
	const pointsSum = candidate?.games.reduce((sum, curr) => sum + curr.pts, 0);
	const isEligible = (pointsSum ?? 0) >= 20;

	return (
		<StyledCandidateVerdict isEligible={isEligible} colorTokens={colorTokens}>
			<Flex align gap={'var(--size-8)'}>
				<Icon icon={isEligible ? 'SquareCheck' : 'SquareX'} size={Size.SMALL} />
				<StyledCandidateVerdictSummary>
					{isEligible
						? 'You are eligible to join!'
						: 'You are not yet eligible to join!'}
				</StyledCandidateVerdictSummary>
			</Flex>
			<StyledCandidatePoints>{pointsSum ?? 0}/20 pts</StyledCandidatePoints>
		</StyledCandidateVerdict>
	);
};

const StyledCandidateVerdict = styled.div<{
	isEligible: boolean;
	colorTokens: ColorTokens;
}>`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: space-between;
	font-family: var(--font-dosis);
	font-weight: 600;
	padding: var(--size-4);
	color: ${({ isEligible, colorTokens }) =>
		isEligible
			? colorTokens[`common-color--black`]
			: colorTokens[`core-primary-text`]};
	background-color: ${({ isEligible, colorTokens }) =>
		isEligible
			? colorTokens[`semantic-color--${ColorMap.SUCCESS}`]
			: colorTokens[`semantic-color--${ColorMap.ERROR}`]};
`;

const StyledCandidateVerdictSummary = styled.div`
	text-align: left;
	font-size: var(--font-size-18);
	line-height: var(--font-size-20);
`;

const StyledCandidatePoints = styled.div`
	display: flex;
	flex: 0 0 auto;
	margin-right: var(--size-8);
	font-family: var(--font-dosis);
	font-size: var(--font-size-20);
`;
