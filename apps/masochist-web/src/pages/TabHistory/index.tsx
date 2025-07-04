import { LogType } from '@masochistme/sdk/dist/v1/types';
import { ErrorFallback, Flex, Icon, Loader, QueryBoundary } from 'components';
import { LogDictionary, TabDict } from 'configuration';
import { Section, SectionProps, SubPage } from 'containers';
import { useActiveTab, useContextualRouting } from 'hooks';
import { t } from 'i18n';
import styled from 'styled-components';
import { LogsFilterBar } from './LogsFilterBar';
import { LogsList } from './LogsList';

export const TabHistory = (): JSX.Element => {
  useActiveTab(TabDict.HISTORY);
  const { setRoute, route: filter } = useContextualRouting<string>({
    key: 'filter',
    value: LogDictionary.map(e => e.type).join(','),
  });

  const setVisibleLogs = (newLogs: LogType[]) => {
    if (newLogs.length > 0) setRoute(newLogs.join(','));
    else setRoute('');
  };

  return (
    <SubPage>
      <StyledLogsList column>
        <Info isMobileOnly />
        <QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
          <LogsFilterBar
            visibleLogs={filter.split(',') as LogType[]}
            setVisibleLogs={setVisibleLogs}
          />
        </QueryBoundary>
        <QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
          <LogsList visibleLogs={filter.split(',') as LogType[]} />
        </QueryBoundary>
      </StyledLogsList>
      <Info isDesktopOnly width="100%" maxWidth="45rem" />
    </SubPage>
  );
};

const Info = (props: Partial<SectionProps>): JSX.Element => (
  <Section
    {...props}
    title="Community's history"
    content={
      <QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
        <InfoBoundary />
      </QueryBoundary>
    }
  />
);

const InfoBoundary = () => {
  const logDescriptions = LogDictionary.map((log, index: number) => (
    <Flex key={`log-desc-${index}`} gap={4}>
      <Icon icon={log.icon} /> - {t(log.description)},
    </Flex>
  ));
  return (
    <Flex column gap={8}>
      <div>This is the list showcasing the last 100 logs.</div>
      <div>
        There are {LogDictionary.length} different types of items that can be
        logged here:
      </div>
      <StyledLogTypes>{logDescriptions}</StyledLogTypes>
    </Flex>
  );
};

const StyledLogsList = styled(Flex)`
  width: 100%;
`;

const StyledLogTypes = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  gap: var(--size-8);
  margin-left: var(--size-12);
  line-height: var(--size-15);
  text-align: left;
`;
