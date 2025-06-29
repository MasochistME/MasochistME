import { LogListParams } from '@masochistme/sdk/dist/v1/api/logs';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

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
