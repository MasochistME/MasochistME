import React, { useContext } from 'react';
import { useBackIfNotAdmin } from 'shared/hooks';
import { AppContext } from 'shared/store/context';
import PageNotFound from 'components/pages/NotFound';
import PageManageBadges from './ManageBadges';
import PageManageUsers from './ManageUsers';
import PageManageGames from './ManageGames';

type SubPage = 'badges' | 'users' | 'games' | undefined;
type Props = {
  page: SubPage;
};

export default function PageAdmin(props: Props): JSX.Element {
  const { page } = props;
  const { isAdmin } = useContext(AppContext);

  useBackIfNotAdmin();

  if (isAdmin && page === 'badges') {
    return <PageManageBadges />;
  }
  if (isAdmin && page === 'games') {
    return <PageManageGames />;
  }
  if (isAdmin && page === 'users') {
    return <PageManageUsers />;
  }
  return <PageNotFound />;
}
