import { Button, FilterBar, Flex } from 'components';
import { TabDict } from 'configuration/tabs';
import { Section, SectionProps, SubPage } from 'containers';
import { BadgeView, useActiveTab, useToggleView } from 'hooks';
import { t } from 'i18n';
import { useMemo } from 'react';
import styled from 'styled-components';
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
    if (badgeListView === BadgeView.TILE) return t('badges.view.toggle_table');
    else return t('badges.view.toggle_grid');
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
      title={t('badges.title')}
      content={
        <Flex column gap={8}>
          <div>{t('badges.info.desc1')}</div>
          <div>
            {t('badges.info.desc2')}
            {/* TODO Localize the text below */}
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
