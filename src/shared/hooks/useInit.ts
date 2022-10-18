import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import {
	cacheUsers,
	cachePatrons,
	// cacheStatus,
} from 'shared/store/Cache';
import { useAppContext } from 'shared/store/context';
import { log } from 'utils';

export const useInit = (): boolean => {
	const dispatch = useDispatch();
	const { path } = useAppContext();
	const [loaded, setLoaded] = useState(false);

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

	// const loadStatus = () => {
	// 	axios
	// 		.get(`${path}/api/status`)
	// 		.then(response => {
	// 			if (response?.status === 200) {
	// 				return dispatch(cacheStatus(response.data));
	// 			}
	// 		})
	// 		.catch(log.WARN);
	// };

	const init = () => {
		loadUsers();
		loadPatrons();
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
