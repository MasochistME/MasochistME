import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'shared/store/context';

/**
 *
 * @returns
 */
export const useBadges = () => {
	const { sdk } = useAppContext();

	const {
		data: badgesData = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'badges'], () => sdk.getBadgesList({}));

	return { badgesData, isLoading, isFetched, isError };
};
