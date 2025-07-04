import { LogType } from '@masochistme/sdk/dist/v1/types';
import { FilterBar, Flex } from 'components';
import { LogDictionary, SingleLog } from 'configuration';
import styled from 'styled-components';
import { media } from 'styles';
import { LogsFilterCheckbox } from './LogsFilterCheckbox';

type Props = {
  visibleLogs: LogType[];
  setVisibleLogs: (visibleLogs: LogType[]) => void;
};

export const LogsFilterBar = (props: Props): JSX.Element => {
  const { visibleLogs, setVisibleLogs } = props;

  return (
    <FilterBar>
      <StyledLogFilterBar>
        {LogDictionary.map((log: SingleLog) => (
          <LogsFilterCheckbox
            key={`checkbox-log-${log.type}`}
            log={log}
            visibleLogs={visibleLogs}
            setVisibleLogs={setVisibleLogs}
          />
        ))}
      </StyledLogFilterBar>
    </FilterBar>
  );
};

const StyledLogFilterBar = styled(Flex)`
  width: 100%;
  gap: var(--size-16);
  flex-wrap: wrap;
  @media (max-width: ${media.smallNetbooks}) {
    justify-content: center;
  }
`;
