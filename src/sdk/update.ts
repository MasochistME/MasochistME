import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from 'context';

export const useUpdateStatus = () => {
	const { sdk } = useAppContext();

	const {
		data: updateData,
		isLoading,
		isFetched,
		isError,
	} = useQuery(['masochist', 'update'], () => sdk.getUpdateStatus(), {
		staleTime: 10000,
		refetchInterval: 10000,
	});

	return { updateData, isLoading, isFetched, isError };
};

/**
 * Call for an update of member with Steam API.
 */
export const useUpdateMemberMutation = (steamId?: string) => {
	const queryClient = useQueryClient();
	const { sdk } = useAppContext();

	const updateMember = async ({ shouldUpdate }: { shouldUpdate: boolean }) => {
		if (steamId && shouldUpdate) {
			const response = await sdk.updateMember({ memberId: steamId });
			return response;
		}
		return { message: 'fail' };
	};

	return useMutation(updateMember, {
		onSuccess: () =>
			queryClient.invalidateQueries(['masochist', 'member', steamId]),
	});
};
