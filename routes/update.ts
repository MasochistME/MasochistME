import { log } from '../helpers/log';
import { connectToDb, getDataFromDB } from '../helpers/db';
import { getCuratorMembers, getCuratorGames } from './curator';

export const initiateMainUpdate = async (req, res) => {
    const members = await getCuratorMembers(req, res);
    const games = await getCuratorGames(req, res);

    const membersFromDB = await getDataFromDB('users');
}