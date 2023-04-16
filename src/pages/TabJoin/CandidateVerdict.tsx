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
			<Flex align gap={'var(--size-8)'} flex="1 1 auto">
				<Icon icon={isEligible ? 'SquareCheck' : 'SquareX'} size={Size.SMALL} />
				<div style={{ fontSize: 'var(--font-size-18)' }}>
					{isEligible
						? 'You are eligible to join!'
						: 'You are not eligible to join yet!'}
				</div>
			</Flex>
			<StyledCandidatePoints>Pts: {pointsSum ?? 0}</StyledCandidatePoints>
		</StyledCandidateVerdict>
	);
};

const StyledCandidateVerdict = styled.div<{
	isEligible: boolean;
	colorTokens: ColorTokens;
}>`
	display: flex;
	align-items: center;
	font-family: var(--font-dosis);
	font-weight: 600;
	padding: var(--size-4);
	color: ${({ isEligible, colorTokens }) =>
		isEligible
			? colorTokens[`core-primary-bg`]
			: colorTokens[`core-primary-text`]};
	background-color: ${({ isEligible, colorTokens }) =>
		isEligible
			? colorTokens[`semantic-color--${ColorMap.SUCCESS}`]
			: colorTokens[`semantic-color--${ColorMap.ERROR}`]};
`;

const StyledCandidatePoints = styled.div`
	display: flex;
	flex-wrap: nowrap;
	font-family: var(--font-dosis);
	font-size: var(--font-size-20);
	margin-right: var(--size-8);
`;
