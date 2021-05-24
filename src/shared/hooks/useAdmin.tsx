import { useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'shared/store/context';

export const useUserPermissions = async (): Promise<void> => {
  const { path, userId, setPermissions, setIsAdmin } = useContext(AppContext);

  const setUserPermissions = async () => {
    const userPermissions = await axios.get(
      `${path}/auth/permissions/${userId}`,
    );
    if (userPermissions?.data) {
      setPermissions(userPermissions.data);
      if (userPermissions.data.includes('admin')) {
        setIsAdmin(true);
      }
    } else {
      setPermissions([]);
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    } else {
      setUserPermissions();
    }
  }, [userId]);
};

export const useBackIfNotAdmin = (): void => {
  const { isAdmin } = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    if (!isAdmin) {
      history.push('/404');
    }
  }, [isAdmin]);
};
