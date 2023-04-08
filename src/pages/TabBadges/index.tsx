import { useMemo } from 'react';
import styled from 'styled-components';

import { useActiveTab, BadgeView, useToggleView } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Button, FilterBar, Flex } from 'components';
import { SubPage, Section, SectionProps } from 'containers';

import { BadgesTableView } from './BadgesTableView';
import { BadgesTileView } from './BadgesTileView';

export const TabBadges = (): JSX.Element => {
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
				<Info isMobileOnly />
				<FilterBar>
					<div />
					<Button
						onClick={toggleBadgeView}
						icon={badgeViewButtonIcon}
						label={badgeViewButtonLabel}
					/>
				</FilterBar>
				{badgeListView === BadgeView.TILE && <BadgesTileView />}
				{badgeListView === BadgeView.TABLE && <BadgesTableView />}
			</StyledBadges>
			<Info isDesktopOnly minWidth="35rem" maxWidth="35rem" />
		</SubPage>
	);
};

const Info = (props: Partial<SectionProps>): JSX.Element => {
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

const StyledBadges = styled(Flex)`
	flex-direction: column;
	width: 110rem;
	max-width: 100%;
`;
