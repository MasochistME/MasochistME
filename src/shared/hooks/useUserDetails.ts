import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cacheUserDetails } from 'shared/store/Cache';
import { useAppContext } from 'shared/store/context';

/**
 * Retrieves particular user's data for the ranking page.
 * @param id: string - user id
 */
export function useUserDetails(id: string): {
	isUserLoaded?: boolean;
	isUserError?: boolean;
} {
	const dispatch = useDispatch();
	const { path } = useAppContext();

	const isUserLoaded = useSelector(
		(state: any) => !!state.users.details.find((user: any) => user.id === id),
	);
	const isUserError = useSelector(
		(state: any) => !!state.users.details.find((user: any) => user.error),
	);

	const getUserDetails = useCallback(async () => {
		const response = await fetch(`${path}/api/ranking/user/${id}`);
		if (response.status === 200) {
			const userDetails = await response?.json();
			dispatch(cacheUserDetails(userDetails));
		}
		if (response.status === 404) {
			dispatch(cacheUserDetails({ id, error: 404 }));
			return;
		}
		dispatch(cacheUserDetails({ id, error: true }));
	}, [id]);

	useEffect(() => {
		if (!isUserLoaded) {
			getUserDetails();
		}
	}, [isUserLoaded]);

	return { isUserLoaded, isUserError };
}
