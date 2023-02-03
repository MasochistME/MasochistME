import { useMemo } from 'react';
import styled from 'styled-components';

import { useActiveTab, BadgeView, useToggleView } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Button, FilterBar, Flex, Loader, QueryBoundary } from 'components';
import { SubPage, Section, SectionProps } from 'containers';

import { BadgesTableView } from './BadgesTableView';
import { BadgesTileView } from './BadgesTileView';

const TabBadges = (): JSX.Element => {
	useActiveTab(TabDict.BADGES);
	const { badgeListView, toggleBadgeView } = useToggleView();

	const badgeViewButtonIcon = useMemo(() => {
		if (badgeListView === BadgeView.TILE) return 'Table';
		if (badgeListView === BadgeView.TABLE) return 'Grid';
		return 'Spin';
	}, [badgeListView]);

	const badgeViewButtonLabel = useMemo(() => {
		if (badgeListView === BadgeView.TILE) return 'Toggle table view';
		else return 'Toggle grid view';
	}, [badgeListView]);

	return (
		<SubPage>
			<StyledBadges>
				<TabBadgesInfo isMobileOnly />
				<FilterBar>
					<div />
					<Button
						onClick={toggleBadgeView}
						icon={badgeViewButtonIcon}
						label={badgeViewButtonLabel}
					/>
				</FilterBar>
				{badgeListView === BadgeView.TILE && (
					<QueryBoundary fallback={<Loader />}>
						<BadgesTileView />
					</QueryBoundary>
				)}
				{badgeListView === BadgeView.TABLE && <BadgesTableView />}
			</StyledBadges>
			<TabBadgesInfo isDesktopOnly minWidth="350px" maxWidth="350px" />
		</SubPage>
	);
};

const TabBadgesInfo = (props: Partial<SectionProps>): JSX.Element => {
	return (
		<Section
			{...props}
			title="Badges"
			content={
				<Flex column gap={8}>
					<div>
						Badges are additional, community defined feats that you can achieve
						in a curated game. They allow you to get recognized for an in-game
						achievement and get rewarded with points before finishing the game.
					</div>
					<div>
						Since badges are granted by moderators manually, you need to submit
						a proof of fulfilling the badge requirement to have it unlocked.
						This is done on our{' '}
						<a href="https://discord.com/invite/NjAeT53kVb" target="_blank">
							Discord server
						</a>
						.
					</div>
				</Flex>
			}
		/>
	);
};

export default TabBadges;

const StyledBadges = styled(Flex)`
	flex-direction: column;
	width: 1100px;
	max-width: 100%;
`;
