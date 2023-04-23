import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

import { LogListParams } from '@masochistme/sdk/dist/v1/api/logs';

/**
 *
 * @param limit
 * @returns
 */
export const useLogs = (params?: LogListParams) => {
	const { sdk } = useAppContext();

	return useQuery(
		['masochist', 'logs', params ? JSON.stringify(params) : ''],
		() => sdk.getLogList({ ...(params ?? {}) }),
	);
};
