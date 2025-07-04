import { Flex, Skeleton } from 'components';
import { Section, SectionProps } from 'containers';
import { t } from 'i18n';
import { useNavigate } from 'react-router';
import { useCuratorMembers, useLeaderboardsMembers } from 'sdk';
import styled from 'styled-components';
import { LogCompact } from './components';

const NUMBER_OF_LEADERS = 10;

export const DashboardTileTop = (
  props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
  const navigate = useNavigate();

  const {
    membersData,
    isLoading: isMembersLoading,
    isFetched: isMembersFetched,
  } = useCuratorMembers();
  const {
    leaderboardsData,
    isLoading: isLeadersLoading,
    isFetched: isLeadersFetched,
  } = useLeaderboardsMembers({ limit: NUMBER_OF_LEADERS });

  const isLoading = isMembersLoading && isLeadersLoading;
  const isFetched = isMembersFetched && isLeadersFetched;

  const leaderboards = leaderboardsData.map(leader => ({
    position: leader.position,
    memberId: leader.memberId,
    sum: leader.sum,
    name:
      membersData.find(member => member.steamId === leader.memberId)?.name ??
      t('unknown').toUpperCase(),
  }));

  const leaderboardRow = (leader: {
    sum: number;
    name: string;
    memberId: string;
    position: number;
  }) => {
    const onUserClick = () => navigate(`/profile/${leader.memberId}`);
    return (
      <StyledSectionTopMember row align key={`leaderboards-${leader.memberId}`}>
        <div>{leader.position}.</div>
        <LogCompact.Link
          onClick={onUserClick}
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          <span>{leader.name}</span>
        </LogCompact.Link>
        <div style={{ whiteSpace: 'nowrap' }}>
          {leader.sum} {t('pts')}
        </div>
      </StyledSectionTopMember>
    );
  };

  const loadingLeaders = new Array(NUMBER_OF_LEADERS)
    .fill(null)
    .map((_, i: number) => (
      <Skeleton key={`badge-new-${i}`} height={22} width="100%" />
    ));

  return (
    <Section
      title={t('dashboard.top.title')}
      minWidth="40rem"
      maxWidth="45rem"
      content={
        <Flex column align justify gap={5}>
          {isLoading && loadingLeaders}
          {isFetched && leaderboards?.map(leader => leaderboardRow(leader))}
        </Flex>
      }
      {...props}
    />
  );
};

export const StyledSectionTopMember = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  padding: 0 var(--size-16);
`;
