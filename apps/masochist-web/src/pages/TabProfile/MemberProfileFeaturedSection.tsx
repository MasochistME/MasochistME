import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FeaturedType } from '@masochistme/sdk/dist/v1/types';

import { useFeaturedFiltered, useMembers } from 'sdk';
import { ErrorFallback, Loader, Pagination, QueryBoundary } from 'components';
import { Section, SectionProps } from 'containers';

import { FeaturedNews, FeaturedVideo } from 'containers/Featured';

type Props = Partial<SectionProps> & {
	memberId: string;
};

export const MemberProfileFeaturedSection = (props: Props): JSX.Element => {
	const { memberId, ...rest } = props;

	return (
		<Section
			fullWidth
			title="Featured"
			content={
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<SectionBoundary memberId={memberId} />
				</QueryBoundary>
			}
			{...rest}
		/>
	);
};

const SectionBoundary = ({ memberId }: Props) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const { featuredData: data } = useFeaturedFiltered({
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

	const hasFeatured = featuredData.length > 0;

	const featuredContent = useMemo(() => {
		const featured = featuredData?.[activeIndex];
		if (!featured) return null;

		if (featured.type === FeaturedType.NEWS)
			return <FeaturedNews featured={featured} isCompact />;
		if (featured.type === FeaturedType.VIDEO)
			return <FeaturedVideo featured={featured} isCompact hideOwner />;
	}, [featuredData, activeIndex]);

	return (
		<StyledMemberProfileFeatured>
			{hasFeatured ? (
				<>
					{featuredContent}
					<Pagination
						isCompact
						nrOfItems={featuredData.length}
						activeIndex={activeIndex}
						setActiveIndex={setActiveIndex}
					/>
				</>
			) : (
				'This member featured no content yet.'
			)}
		</StyledMemberProfileFeatured>
	);
};

const StyledMemberProfileFeatured = styled.div`
	display: flex;
	flex-direction: column;
	flex-flow: row wrap;
	justify-content: center;
	align-items: center;
	gap: var(--size-8);
	width: 100%;
`;
