import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { useFeaturedFiltered, useAllMembers } from 'sdk';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Flex, Loader } from 'components';
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

const TabChangelog = (props: Props): JSX.Element => {
	useActiveTab(TabDict.CHANGELOG);

	const { membersData } = useAllMembers();
	const { featuredData, isLoading } = useFeaturedFiltered({
		filter: { type: FeaturedType.NEWS },
		sort: { date: 'desc' },
	});

	const postData = (featuredData as TFeaturedNews[]).map(
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

	return (
		<SubPage>
			<StyledContent column>
				{postData.map((post: Post) => (
					<Section
						{...props}
						title={post.title}
						isCentered={false}
						anchorId={post.anchorId}
						fullWidth
						maxWidth="1000px"
						content={
							isLoading ? <Loader /> : <FeaturedNews featured={post.data} />
						}
					/>
				))}
			</StyledContent>
			<TabChangelogInfo
				posts={postData}
				isDesktopOnly
				width="100%"
				maxWidth="450px"
			/>
		</SubPage>
	);
};

export default TabChangelog;

const TabChangelogInfo = (
	props: Partial<SectionProps> & { posts: Post[] },
): JSX.Element => {
	const { posts, ...rest } = props;
	return (
		<Section
			{...rest}
			title="Archive"
			content={
				<Flex column>
					{posts.map(f => {
						const sanitizedAnchorId = f.anchorId?.replace(/[^a-zA-Z0-9]/gm, '');
						return <a href={`#${sanitizedAnchorId}`}>{f.date}</a>;
					})}
				</Flex>
			}
		/>
	);
};

const StyledContent = styled(Flex)`
	gap: 12px;
	justify-content: space-between;
	height: 100%;
`;
