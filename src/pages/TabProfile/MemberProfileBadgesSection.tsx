import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { Flex, Loader, QueryBoundary, ErrorFallback } from 'components';
import { BadgeThumbnail, Section } from 'containers';
import { useActiveTab, useMemberBadgesFilter } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Size } from 'components';

type Props = {
	memberId: string;
};

export const MemberProfileBadgesSection = (props: Props): JSX.Element => {
	useActiveTab(TabDict.PROFILE);

	return (
		<Section
			title="Badges"
			width="100%"
			maxWidth="45rem"
			content={
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<SectionBoundary {...props} />
				</QueryBoundary>
			}
		/>
	);
};

const SectionBoundary = (props: Props) => {
	const { memberId } = props;
	const navigate = useNavigate();

	const { memberBadges } = useMemberBadgesFilter(memberId);

	const badges = memberBadges.map(badge => (
		<BadgeThumbnail
			badge={badge}
			size={Size.BIG}
			key={`member-badge-${String(badge._id)}`}
			onClick={() => onBadgeClick(badge.gameId)}
		/>
	));

	const onBadgeClick = (gameId: number | null) => {
		if (gameId) navigate(`/game/${gameId}`);
	};

	return (
		<StyledMemberProfileBadges justify>
			{memberBadges.length === 0
				? 'This member unlocked no badges yet.'
				: badges}
		</StyledMemberProfileBadges>
	);
};

const StyledMemberProfileBadges = styled(Flex)`
	gap: var(--size-8);
	width: 100%;
	flex-flow: row wrap;
`;
