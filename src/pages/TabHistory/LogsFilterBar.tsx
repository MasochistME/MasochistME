import React from 'react';
import styled from 'styled-components';

import { useAppContext } from 'context';
import { SingleLog, LogDictionary } from 'configuration';
import { media } from 'styles';
import { FilterBar, Flex } from 'components';

import { LogsFilterCheckbox } from './LogsFilterCheckbox';

export const LogsFilterBar = (): JSX.Element => {
	const { visibleLogs, setVisibleLogs } = useAppContext();

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
