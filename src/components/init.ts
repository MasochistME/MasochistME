import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import axios from 'axios';
import {
	cacheGames,
	cacheUsers,
	cacheBlog,
	cachePatrons,
	cacheRanking,
	cacheStatus,
	cacheUserDetails,
	cacheGameDetails,
} from 'shared/store/modules/Cache';
import { useAppContext } from 'shared/store/context';
import { showGamesRated } from 'shared/store/modules/CheckBoxes';
import { log } from 'shared/helpers';
import { useTiers } from 'shared/hooks';

export default function useInit(): boolean {
	const dispatch = useDispatch();
	const { path } = useAppContext();
	const { tiersData } = useTiers();
	const [loaded, setLoaded] = useState(false);

	const loadRating = () => {
		dispatch(showGamesRated(tiersData.map((r: any) => r.id)));
	};

	const loadGames = () => {
		axios
			.get(`${path}/api/curator/games`)
			.then(response => {
				if (response?.status === 200) {
					return dispatch(
						cacheGames(
							orderBy(response.data, ['rating', 'title'], ['desc', 'asc']),
						),
					);
				}
			})
			.catch(log.WARN);
	};

	const loadUsers = () => {
		axios
			.get(`${path}/api/users`)
			.then(response => {
				if (response?.status === 200) {
					return dispatch(cacheUsers(response.data));
				}
			})
			.catch(log.WARN);
	};

	const loadPatrons = () => {
		axios
			.get(`${path}/api/patrons`)
			.then(response => {
				if (response?.status === 200) {
					return dispatch(cachePatrons(response.data));
				}
			})
			.catch(log.WARN);
	};

	const loadBlog = () => {
		axios
			.get(`${path}/api/blog`)
			.then(response => {
				if (response?.status === 200) {
					return dispatch(cacheBlog(response.data));
				}
			})
			.catch(log.WARN);
	};

	const loadRanking = () => {
		axios
			.get(`${path}/api/ranking`)
			.then(response => {
				if (response?.status === 200) {
					return dispatch(cacheRanking(response.data));
				}
			})
			.catch(log.WARN);
	};

	const loadStatus = () => {
		axios
			.get(`${path}/api/status`)
			.then(response => {
				if (response?.status === 200) {
					return dispatch(cacheStatus(response.data));
				}
			})
			.catch(log.WARN);
	};

	const init = () => {
		loadGames();
		loadUsers();
		loadRating();
		loadBlog();
		loadPatrons();
		loadRanking();
		// TODO disabled when dev/staging
		// setInterval(() => {
		// 	loadStatus();
		// }, 1000);
		setLoaded(true);
	};

	useEffect(() => {
		init();
	}, []);

	return loaded;
}

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

/**
 * Retrieves leaderboards data for a particular game.
 * @param id - game id
 */
export function useGameDetails(id: string): boolean {
	const { path } = useAppContext();
	const dispatch = useDispatch();
	const loaded = useSelector(
		(state: any) =>
			!!state.games.details.find((game: any) => Number(game.id) === Number(id)),
	);

	const loadGameDetails = () => {
		axios
			.get(`${path}/api/ranking/game/${id}`)
			.then(response => {
				if (response?.status === 200) {
					dispatch(cacheGameDetails(response.data));
				}
			})
			.catch(log.WARN);
	};

	useEffect(() => {
		if (!loaded) {
			loadGameDetails();
		}
	}, [loaded]);

	return loaded;
}
