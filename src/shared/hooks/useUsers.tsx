import { useSelector } from 'react-redux';

export const useUsers = (membersOnly: boolean): any => {
  const users = useSelector((state: any) =>
    state.users.list.filter((user: any) =>
      membersOnly ? user.protected || user.member : user,
    ),
  );
  return users;
};
