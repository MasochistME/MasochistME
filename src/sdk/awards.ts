import { AwardsListParams } from '@masochistme/sdk/dist/v1/api/awards';
import { Award, AwardCategory } from '@masochistme/sdk/dist/v1/types';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'context';

/**
 *
 * @returns
 */
export const useAwards = (params?: AwardsListParams) => {
	const { sdk } = useAppContext();

	const {
		data = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(
		['masochist', 'awards', params ? JSON.stringify(params) : ''],
		() => sdk.getAwardsList({ ...(params ?? {}) }),
	);

	// TODO move this type to SDK
	const awardsData = data as unknown as (AwardCategory & { awards: Award[] })[];

	return { awardsData, isLoading, isFetched, isError };
};
