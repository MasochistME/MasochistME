import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { useFeaturedFiltered, useAllMembers } from 'sdk';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Flex, Loader, QueryBoundary, ErrorFallback } from 'components';
import { FeaturedNews, Section, SectionProps, SubPage } from 'containers';
import {
	FeaturedNews as TFeaturedNews,
	FeaturedType,
	Member,
} from '@masochistme/sdk/dist/v1/types';

type Post = {
	data: TFeaturedNews;
	date: string;
	title: string;
	anchorId: string;
};

type Props = {
	//
};

export const TabChangelog = (props: Props): JSX.Element => {
	useActiveTab(TabDict.CHANGELOG);

	return (
		<SubPage>
			<StyledContent column>
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<Posts {...props} />
				</QueryBoundary>
			</StyledContent>
			<Info isDesktopOnly width="100%" maxWidth="45rem" />
		</SubPage>
	);
};

const Posts = (props: Props) => {
	const { posts } = usePosts();
	return (
		<>
			{posts.map((post: Post) => (
				<Section
					{...props}
					title={post.title}
					isCentered={false}
					anchorId={post.anchorId}
					fullWidth
					maxWidth="100rem"
					content={<FeaturedNews featured={post.data} />}
				/>
			))}
		</>
	);
};

type InfoProps = Partial<SectionProps>;
const Info = (props: InfoProps) => (
	<Section
		title="Archive"
		content={
			<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
				<InfoBoundary />
			</QueryBoundary>
		}
		{...props}
	/>
);

const InfoBoundary = () => {
	const { posts } = usePosts();
	return (
		<Flex column>
			{posts.map(post => {
				const sanitizedAnchorId = post.anchorId?.replace(/[^a-zA-Z0-9]/gm, '');
				return <a href={`#${sanitizedAnchorId}`}>{post.date}</a>;
			})}
		</Flex>
	);
};

const usePosts = () => {
	const { membersData } = useAllMembers();
	const { featuredData } = useFeaturedFiltered({
		filter: { type: FeaturedType.NEWS },
		sort: { date: 'desc' },
	});
	const posts = (featuredData as TFeaturedNews[]).map(
		(featured: TFeaturedNews) => {
			const member = membersData.find(
				(m: Member) =>
					m.discordId === featured.memberId || m.steamId === featured.memberId,
			);
			const date = dayjs(featured.date).format('D. MMMM YYYY');
			const title = `${member?.name ?? 'UNKNOWN MODERATOR'} ~ ${date}`;
			const anchorId = title.replace(' ', '_');

			return { data: featured, date, title, anchorId };
		},
	);

	return { posts };
};

const StyledContent = styled(Flex)`
	gap: var(--size-12);
	justify-content: space-between;
	height: 100%;
	width: 100rem;
	max-width: 100%;
`;
