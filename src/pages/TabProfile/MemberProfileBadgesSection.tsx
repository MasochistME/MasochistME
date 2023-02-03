import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { Flex, Loader } from 'components';
import { BadgeThumbnail, Section } from 'containers';
import { useActiveTab, useMemberBadgesFilter } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Size } from 'components';

type Props = {
	memberId: string;
};

export const MemberProfileBadgesSection = (props: Props): JSX.Element => {
	const { memberId } = props;
	const history = useHistory();

	useActiveTab(TabDict.PROFILE);

	const { memberBadges, isLoading, isFetched } =
		useMemberBadgesFilter(memberId);

	const onBadgeClick = (gameId: number | null) => {
		if (gameId) history.push(`/game/${gameId}`);
	};

	const badges = memberBadges.map(badge => (
		<BadgeThumbnail
			badge={badge}
			size={Size.BIG}
			key={`member-badge-${String(badge._id)}`}
			onClick={() => onBadgeClick(badge.gameId)}
		/>
	));

	return (
		<Section
			title="Badges"
			width="100%"
			maxWidth="450px"
			content={
				<StyledMemberProfileBadges justify>
					{isLoading && <Loader />}
					{isFetched && memberBadges.length === 0
						? 'This member unlocked no badges yet.'
						: badges}
				</StyledMemberProfileBadges>
			}
		/>
	);
};

const StyledMemberProfileBadges = styled(Flex)`
	gap: 8px;
	width: 100%;
	flex-flow: row wrap;
`;
