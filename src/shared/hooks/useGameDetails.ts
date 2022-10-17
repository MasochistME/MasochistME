import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { cacheGameDetails } from 'shared/store/Cache';
import { useAppContext } from 'shared/store/context';
import { log } from 'shared/helpers';

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
