import { useAppContext } from 'context';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useEffect } from 'react';

export enum GameView {
  TILE = 'tiles',
  TABLE = 'table',
}
export enum BadgeView {
  TILE = 'tiles',
  TABLE = 'table',
}

const DEFAULT_VIEW_BADGES = { view: BadgeView.TILE };
const DEFAULT_VIEW_GAMES = { view: GameView.TILE };

export const useToggleView = () => {
  const [badgeListView, setBadgeListView] = useLocalStorage<
    Record<string, BadgeView>
  >('MME_BADGE_VIEW', DEFAULT_VIEW_BADGES);
  const [gameListView, setGameListView] = useLocalStorage<
    Record<string, GameView>
  >('MME_GAME_VIEW', DEFAULT_VIEW_GAMES);

  const { _setGameListView, _setBadgeListView } = useAppContext();

  useEffect(() => {
    _setGameListView(gameListView?.view ?? GameView.TILE);
    _setBadgeListView(badgeListView?.view ?? BadgeView.TILE);
  }, [badgeListView, gameListView]);

  const toggleBadgeView = () => {
    if (badgeListView.view === BadgeView.TILE) {
      setBadgeListView({ view: BadgeView.TABLE });
    }
    if (badgeListView.view === BadgeView.TABLE) {
      setBadgeListView({ view: BadgeView.TILE });
    }
  };

  const toggleGameView = () => {
    if (gameListView.view === GameView.TILE) {
      setGameListView({ view: GameView.TABLE });
    }
    if (gameListView.view === GameView.TABLE) {
      setGameListView({ view: GameView.TILE });
    }
  };

  return {
    badgeListView: badgeListView.view,
    gameListView: gameListView.view,
    toggleBadgeView,
    toggleGameView,
  };
};
