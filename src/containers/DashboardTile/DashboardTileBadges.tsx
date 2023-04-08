import React from 'react';
import styled from 'styled-components';
import { LogBadgeCreate, LogType } from '@masochistme/sdk/dist/v1/types';

import { media } from 'styles';
import { useBadges, useLogs } from 'sdk';
import { BadgeThumbnail, Section, SectionProps } from 'containers';
import { Flex, ErrorFallback, QueryBoundary } from 'components';
import { Size } from 'components';

const NUMBER_OF_BADGES = 5;

type Props = Omit<SectionProps, 'content' | 'title'>;
export const DashboardTileBadges = (props: Props) => {
	const badges = new Array(NUMBER_OF_BADGES)
		.fill(null)
		.map((_, i: number) => (
			<BadgeThumbnail isLoading key={`badge-new-${i}`} size={Size.BIG} />
		));

	return (
		<QueryBoundary
			fallback={<Content content={badges} />}
			errorFallback={<Content content={<ErrorFallback />} />}>
			<DashboardTileBadgesBoundary {...props} />
		</QueryBoundary>
	);
};

type ContentProps = Props & { content: React.ReactNode };
const Content = ({ content, ...props }: ContentProps) => (
	<Section
		width="100%"
		maxWidth="45rem"
		title="New badges"
		content={<StyledNewBadges>{content}</StyledNewBadges>}
		{...props}
	/>
);

const DashboardTileBadgesBoundary = (props: Props) => {
	const { badgesData } = useBadges();
	const { data: logs = [] } = useLogs({
		filter: { type: LogType.BADGE_CREATE },
		sort: { date: 'desc' },
		limit: NUMBER_OF_BADGES,
	});

	const badgeLogs = logs.filter(
		log => log.type === LogType.BADGE_CREATE,
	) as unknown as LogBadgeCreate[];

	const badges = badgeLogs.map(log => {
		const badge = badgesData.find(badge => String(badge._id) === log.badgeId);
		if (badge)
			return (
				<BadgeThumbnail
					key={`badge-new-${badge._id}`}
					badge={badge}
					size={Size.BIG}
				/>
			);
	});

	return <Content content={badges} {...props} />;
};

const StyledNewBadges = styled(Flex)`
	justify-content: center;
	gap: var(--size-16);
	@media (max-width: ${media.smallNetbooks}) {
		gap: var(--size-4);
		flex-wrap: wrap;
	}
`;
