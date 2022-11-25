import { useMemo, Suspense } from 'react';
import styled from 'styled-components';

import { useActiveTab } from 'hooks';
import { useAppContext, BadgeView } from 'context';
import { TabDict } from 'configuration/tabs';
import { Button, FilterBar, Flex, Loader } from 'components';
import { SubPage } from 'containers';
import { media } from 'styles';

import { BadgesTableView } from './BadgesTableView';
import { BadgesTileView } from './BadgesTileView';

const TabBadges = (): JSX.Element => {
	useActiveTab(TabDict.BADGES);
	const { badgeListView, setBadgeListView } = useAppContext();

	const badgeViewButtonIcon = useMemo(() => {
		if (badgeListView === BadgeView.TILE) return 'Table';
		if (badgeListView === BadgeView.TABLE) return 'Grid';
		return 'Spin';
	}, [badgeListView]);

	const badgeViewButtonLabel = useMemo(() => {
		if (badgeListView === BadgeView.TILE) return 'Toggle table view';
		else return 'Toggle grid view';
	}, [badgeListView]);

	const onBadgeViewClick = () => {
		if (badgeListView === BadgeView.TILE) setBadgeListView(BadgeView.TABLE);
		if (badgeListView === BadgeView.TABLE) setBadgeListView(BadgeView.TILE);
	};

	return (
		<SubPage>
			<Flex column width="100%">
				<FilterBar>
					<div />
					<Button
						onClick={onBadgeViewClick}
						icon={badgeViewButtonIcon}
						label={badgeViewButtonLabel}
					/>
				</FilterBar>
				{badgeListView === BadgeView.TILE && (
					<Suspense fallback={<Loader />}>
						<BadgesTileView />
					</Suspense>
				)}
				{badgeListView === BadgeView.TABLE && <BadgesTableView />}
			</Flex>
		</SubPage>
	);
};

export default TabBadges;
