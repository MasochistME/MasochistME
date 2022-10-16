import { useQuery } from '@tanstack/react-query';
import { useAppContext } from 'shared/store/context';

export const useBadges = () => {
	const { sdk } = useAppContext();

	const {
		data = [],
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'badges'], () => sdk.getBadgesList());

	return { data, isLoading, isFetched, isError };
};
