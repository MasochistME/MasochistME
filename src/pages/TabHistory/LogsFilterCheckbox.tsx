import React from 'react';
import { LogType } from '@masochistme/sdk/dist/v1/types';

import { SingleLog } from 'configuration';
import { Checkbox } from 'components';

type Props = {
	log: SingleLog;
	visibleLogs: LogType[];
	setVisibleLogs: (visibleLogs: LogType[]) => void;
};

export const LogsFilterCheckbox = (props: Props): JSX.Element => {
	const { log, visibleLogs, setVisibleLogs } = props;

	return (
		<Checkbox
			icon={log.icon}
			itemType={log.type}
			itemDescription={log.description}
			visibleItems={visibleLogs}
			setVisibleItems={setVisibleLogs}
		/>
	);
};
