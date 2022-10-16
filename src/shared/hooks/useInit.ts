import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { orderBy } from 'lodash';
import axios from 'axios';

import {
	cacheGames,
	cacheUsers,
	cacheBlog,
	cachePatrons,
	cacheRanking,
	cacheStatus,
} from 'shared/store/modules/Cache';
import { useAppContext } from 'shared/store/context';
import { showGamesRated } from 'shared/store/modules/CheckBoxes';
import { log } from 'shared/helpers';
import { useTiers } from 'shared/hooks';

export const useInit = (): boolean => {
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
};
