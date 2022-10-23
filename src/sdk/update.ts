import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from 'context';

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
