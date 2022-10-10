import { getDataFromDB } from 'helpers/db';
import { log } from 'helpers/log';

export const getUserPermissions = async (req: any, res: any): Promise<void> => {
  try {
    const member = await getDataFromDB('members', { id: req.params.steamid });
    const groups = await getDataFromDB('groups');

    if (!member?.[0]?.groups) {
      res.status(200).send([]);
      return;
    }
    if (!groups?.length) {
      res.sendStatus(500);
      return;
    }
    const fixedMemberPermissions: string[] = [];
    member[0].groups.forEach((memberGroup: string) => {
      const memberPermissions =
        groups.find((group: any) => group.name === memberGroup)?.permissions ??
        [];
      memberPermissions.forEach((permission: any) => {
        permission.scope.forEach((scope: any) =>
          fixedMemberPermissions.push(`${permission.name}:${scope}`),
        );
      });
    });
    const memberIsAdmin = member[0].groups.includes('admin');
    if (memberIsAdmin) {
      fixedMemberPermissions.unshift('admin');
    }
    res.status(200).send(fixedMemberPermissions);
  } catch (error: any) {
    log.WARN(error);
  }
};
