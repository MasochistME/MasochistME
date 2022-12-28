import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FeaturedType } from '@masochistme/sdk/dist/v1/types';

import { useFeaturedFiltered, useMembers } from 'sdk';
import { Flex, Loader, Pagination } from 'components';
import { Section } from 'containers';

import { FeaturedNews, FeaturedVideo } from 'containers/Featured';

type Props = {
	memberId: string;
};

export const MemberProfileFeaturedSection = (props: Props): JSX.Element => {
	const { memberId } = props;
	const [activeIndex, setActiveIndex] = useState(0);
	const {
		featuredData: data,
		isLoading,
		isFetched,
		isError,
	} = useFeaturedFiltered({
		filter: { isApproved: true, isVisible: true },
		sort: { date: 'desc' },
	});
	const { membersData } = useMembers();
	const discordId = membersData.find(
		member => member.steamId === memberId,
	)?.discordId;
	const featuredData = data.filter(
		f => f.memberId === discordId || f.memberId === memberId,
	);

	const featuredContent = useMemo(() => {
		const featured = featuredData?.[activeIndex];
		if (!featured || !isFetched || isError) return null;

		if (featured.type === FeaturedType.NEWS)
			return <FeaturedNews featured={featured} isCompact />;
		if (featured.type === FeaturedType.VIDEO)
			return <FeaturedVideo featured={featured} isCompact hideOwner hideDate />;
	}, [featuredData, isFetched, isError, activeIndex]);

	if (!featuredData.length) return <span />;
	return (
		<Section
			fullWidth
			title="Featured"
			content={
				<StyledMemberProfileFeatured column>
					{isLoading ? <Loader /> : featuredContent}
					<Pagination
						isCompact
						nrOfItems={featuredData.length}
						activeIndex={activeIndex}
						setActiveIndex={setActiveIndex}
					/>
				</StyledMemberProfileFeatured>
			}
			{...props}
		/>
	);
};

const StyledMemberProfileFeatured = styled(Flex)`
	gap: 8px;
	width: 100%;
	flex-flow: row wrap;
	justify-content: space-between;
`;
