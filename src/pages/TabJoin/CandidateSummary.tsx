import styled from 'styled-components';
import { useMemo, useState } from 'react';

import { useCandidateSummary, useTiers } from 'sdk';
import { StatBlock } from 'containers';
import {
	Alert,
	ErrorFallback,
	Flex,
	Icon,
	IconType,
	Loader,
	QueryBoundary,
	Size,
} from 'components';
import { validateSteamUrl } from './utils';
import { ColorTokens, media, useTheme } from 'styles';
import { ColorMap, getAvatarFromHash } from 'utils';

type Props = {
	steamUrl: string;
	isServerError: boolean;
	setIsServerError: (isServerError: boolean) => void;
};
export const CandidateSummary = ({
	steamUrl,
	// isServerError,
	setIsServerError,
}: Props) => {
	const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
	const [serverError, setServerError] = useState<Error>();

	const { error } = validateSteamUrl(steamUrl);

	const onReset = () => {
		setIsServerError(false);
	};
	const onError = (e: Error) => {
		setServerError(e);
	};

	if (!steamUrl.length) return null;
	return (
		<QueryBoundary
			fallback={<CandidateSummaryLoader />}
			errorFallback={<CandidateSummaryError error={serverError} />}
			displayError
			onReset={onReset}
			onError={onError}>
			<CandidateSummaryBoundary steamUrl={steamUrl} />
			<Alert
				severity="error"
				message={error}
				isOpen={isAlertOpen}
				setIsOpen={setIsAlertOpen}
			/>
		</QueryBoundary>
	);
};

const CandidateSummaryBoundary = ({ steamUrl }: Pick<Props, 'steamUrl'>) => {
	const { colorTokens, LOGO_URL_STATIC } = useTheme();
	const { candidateData } = useCandidateSummary(steamUrl);
	const { tiersData } = useTiers();

	const pointsSum = candidateData?.games.reduce(
		(sum, curr) => sum + curr.pts,
		0,
	);
	const tiersSum = tiersData.map(tier => ({
		tier: tier.id,
		icon: tier.icon,
		pts: candidateData?.games.reduce(
			(sum, curr) => (curr.tier === tier.id ? sum + curr.pts : sum),
			0,
		),
	}));
	const isEligible = (pointsSum ?? 0) >= 20;

	const groupedTierPoints = useMemo(
		() => (
			<Flex row gap={8}>
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
		<Flex column>
			<StyledCandidateHeader row align>
				<Flex align gap={16}>
					<StyledCandidateAvatar
						src={
							getAvatarFromHash(candidateData.avatarHash, 'full') ??
							LOGO_URL_STATIC
						}
						size={Size.BIG}
						colorTokens={colorTokens}
						alt="Member avatar"
						loading="lazy"
					/>
					<a href={steamUrl} target="_blank" rel="noopener noreferrer">
						<StyledCandidateUsername>
							<Icon icon="Steam" marginRight="10px" />
							{candidateData.name}
						</StyledCandidateUsername>
					</a>
				</Flex>
				<StatBlock
					title={
						<StatBlock.Title>
							{isEligible
								? 'You are eligible to join!'
								: 'You are not eligible to join yet!'}
						</StatBlock.Title>
					}
					label={pointsSum ?? 0}
					sublabel="points total"
					icon={isEligible ? 'SquareCheck' : 'SquareX'}
					tier={isEligible ? ColorMap.SUCCESS : ColorMap.ERROR}
				/>
			</StyledCandidateHeader>
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

const CandidateSummaryError = ({ error }: { error?: Error }) => {
	console.log(error);
	return <ErrorFallback />;
};

const StyledCandidateHeader = styled(Flex)`
	max-width: 100%;
	padding: 8px;
	gap: 8px;
	justify-content: space-between;
	align-items: flex-start;
`;

const StyledCandidateAvatar = styled.img<{
	size: Size;
	colorTokens: ColorTokens;
}>`
	object-fit: contain;
	max-width: ${({ size }) => size}rem;
	max-height: ${({ size }) => size}rem;
	min-width: ${({ size }) => size}rem;
	min-height: ${({ size }) => size}rem;
	border: ${({ size, colorTokens }) =>
		`${size === Size.SMALL || size === Size.TINY ? 0.2 : 0.3}rem 
		solid ${colorTokens['core-primary-bg']}`};
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledCandidateUsername = styled.h2`
	display: flex;
	align-items: center;
	margin: 0;
	max-width: 600px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 24px;
`;
