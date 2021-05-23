import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import axios from 'axios';
import {
  cacheGames,
  cacheUsers,
  cacheRating,
  cacheEvents,
  cacheBlog,
  cachePatrons,
  cacheBadges,
  cacheRanking,
  cacheStatus,
  cacheUserDetails,
  cacheGameDetails,
} from 'shared/store/modules/Cache';
import { AppContext } from 'shared/store/context';
import { showGamesRated } from 'shared/store/modules/CheckBoxes';
import { log } from 'shared/helpers';

export default function useInit(): boolean {
  const dispatch = useDispatch();
  const { path } = useContext(AppContext);
  const [loaded, setLoaded] = useState(false);

  const loadRating = () => {
    axios
      .get(`${path}/api/rating`)
      .then(response => {
        if (response?.status === 200) {
          dispatch(showGamesRated(response.data.map((r: any) => r.id)));
          dispatch(cacheRating(response.data));
        }
      })
      .catch(log.WARN);
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

  const loadEvents = () => {
    axios
      .post(`${path}/api/events`, { limit: 100 })
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cacheEvents(response.data));
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

  const loadBadges = () => {
    axios
      .get(`${path}/api/badges`)
      .then(response => {
        if (response?.status === 200) {
          return dispatch(cacheBadges(response.data));
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
    loadEvents();
    loadBlog();
    loadBadges();
    loadPatrons();
    loadRanking();
    setInterval(() => {
      loadStatus();
    }, 1000);
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
export function useUserDetails(id: string): boolean {
  const dispatch = useDispatch();
  const { path } = useContext(AppContext);
  const loaded = useSelector(
    (state: any) => !!state.users.details.find((user: any) => user.id === id),
  );

  const loadUserDetails = () => {
    axios
      .get(`${path}/api/ranking/user/${id}`)
      .then(response => {
        if (response?.status === 200) {
          dispatch(cacheUserDetails(response.data));
        }
      })
      .catch(log.WARN);
  };

  useEffect(() => {
    if (!loaded) {
      loadUserDetails();
    }
  }, [loaded]);

  return loaded;
}

/**
 * Retrieves leaderboards data for a particular game.
 * @param id - game id
 */
export function useGameDetails(id: string): boolean {
  const { path } = useContext(AppContext);
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
