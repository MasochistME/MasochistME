import React, { useEffect } from 'react';
import styled from 'styled-components';

import { PatreonTier, PatronTier } from '@masochistme/sdk/dist/v1/types';
import { usePatreonTiers, useMemberLeaderboards, useMemberById } from 'sdk';
import { ErrorFallback, Flex, Loader, QueryBoundary } from 'components';
import { useTheme, ColorTokens } from 'styles';

import { MemberProfileHeader } from './MemberProfileHeader';
import { MemberProfileStats } from './MemberProfileStats';
import { useMixpanel } from 'hooks';

type Props = { id: string };
export const MemberProfileTop = ({ id }: Props) => (
	<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
		<MemberProfileTopBoundary id={id} />
	</QueryBoundary>
);

const MemberProfileTopBoundary = ({ id }: Props) => {
	const { track } = useMixpanel();
	const { colorTokens } = useTheme();

	const { memberData: member } = useMemberById(id);
	const { leaderData } = useMemberLeaderboards(id);
	const { patreonTiersData } = usePatreonTiers();

	useEffect(() => {
		if (member?.name) track('tab.profile.visit', { name: member.name, id });
	}, [member]);

	const patron = (patreonTiersData.find(
		patreonTier => patreonTier.id === leaderData?.patreonTier,
	) ?? {
		description: 'Unknown',
		symbol: 'Medal',
	}) as Partial<PatreonTier>;

	const isHighestPatronTier = leaderData?.patreonTier === PatronTier.TIER4;
	const getTierColor = () => {
		if (patron?.id === PatronTier.TIER4)
			return colorTokens['semantic-color--tier-4'];
		return null;
	};

	return (
		<StyledMemberProfileTop
			colorTokens={colorTokens}
			isHighestPatronTier={isHighestPatronTier}
			tierColor={getTierColor()}>
			<MemberProfileHeader memberId={id} patron={patron} />
			<MemberProfileStats memberId={id} patron={patron} />
		</StyledMemberProfileTop>
	);
};

const StyledMemberProfileTop = styled(Flex)<{
	colorTokens: ColorTokens;
	isHighestPatronTier?: boolean;
	tierColor: string | null;
}>`
	flex-direction: column;
	background-color: ${({ colorTokens, isHighestPatronTier }) => {
		if (isHighestPatronTier)
			return `${colorTokens['semantic-color--tier-4']}33`;
		return `${colorTokens['core-tertiary-bg']}cc`;
	}};
	color: ${({ colorTokens, isHighestPatronTier }) => {
		if (isHighestPatronTier) return `${colorTokens['semantic-color--tier-4']}`;
		return `inherit`;
	}};
	border-radius: var(--border-radius-16);
	${({ tierColor }) => `border: var(--size-2) solid ${tierColor}`};
`;
