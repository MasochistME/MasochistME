import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Flex } from 'components';
import { BadgeThumbnail, Section } from 'containers';
import { useActiveTab, useMemberBadgesFilter } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { Size } from 'utils';

type Props = {
	memberId: string;
};

export const MemberProfileBadgesSection = (props: Props): JSX.Element => {
	const { memberId } = props;
	const history = useHistory();

	useActiveTab(TabDict.PROFILE);

	const memberBadgesData = useMemberBadgesFilter(memberId);

	const onBadgeClick = (gameId: number | null) => {
		if (gameId) history.push(`/game/${gameId}`);
	};

	const memberBadges = memberBadgesData.map(badge => (
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
					{memberBadges.length !== 0
						? memberBadges
						: 'This member unlocked no badges yet.'}
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
