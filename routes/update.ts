import axios from 'axios';
import { log } from '../helpers/log';
import { connectToDb, getDataFromDB } from '../helpers/db';
import { getCuratorMembers, updateCuratorGames } from './curator';
import config from '../config.json';

type TMemberJoinedEvent = {
    date:number,
    type:'memberJoined',
    member:string
}
type TMemberLeftEvent = {
    date:number,
    type:'memberLeft',
    member:string
}

const updateDelay = 43200000

export const getStatus = async (req, res) => {
    try {
        const lastUpdated = await getDataFromDB('special', { id: 'lastUpdated' });
        res.status(200).send({ lastUpdated: lastUpdated[0].timestamp });
        return;
    }
    catch(err) {
        log.WARN(err);
        res.status(500).send(err)
    }
}

export const initiateMainUpdate = async (req, res) => {
    const { client, db } = await connectToDb();
    const usersFromDB = await getDataFromDB('users');
    let members; 
    let games;

    try {
        const lastUpdated = await getDataFromDB('special', { id: 'lastUpdated' }); // don't update too fast
        if (Date.now() - lastUpdated[0].timestamp < updateDelay) {
            res.status(202).send(`Wait ${(updateDelay - (Date.now() - lastUpdated[0].timestamp))/60000 } min before updating`);
            return;
        }
    }
    catch(err) {
        log.WARN(err);
        res.status(500).send(err)
    }

    res.sendStatus(202);

    try {
        members = await getCuratorMembers();
    }
    catch(err) {
        log.WARN(err);
        return;
    }

    try {
        games = await updateCuratorGames();
    }
    catch(err) {
        log.WARN(err);
        return;
    }
    usersFromDB.map(userFromDB => {
        if (userFromDB.member && !members.find(member => userFromDB.id === member.id)) {
            log.INFO(`--> [UPDATE] events - member ${userFromDB.id} left`)
            const eventDetails:TMemberLeftEvent = {
                date: Date.now(),
                type:'memberLeft', // TODO remove his member status!!!
                member: userFromDB.id
            }
            db.collection('events').insertOne(eventDetails, (err, data) => { });
        }
    })

    const iterateMembers = async (index:number) => {
        if (!usersFromDB.find(userFromDB => userFromDB.id === members[index].id)) {            
            const userUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.STEAM_KEY}&steamids=${members[index].id}`;
            let userData;

            log.INFO(`--> [UPDATE] member ${members[index].id}`);

            try {
                userData = await axios.get(userUrl);
                const user = userData.data.response.players[0];
                members[index].name = user.personaname;
                members[index].avatar = user.avatarfull;
            }
            catch(err) {
                log.WARN(`--> [UPDATE] member ${members[index].id} [ERROR]`);
                log.WARN(err);
            }
            const eventDetails:TMemberJoinedEvent = {
                date: Date.now(),
                type:'memberJoined',
                member: members[index].id
            }
            db.collection('events').insertOne(eventDetails, (err, data) => {})
            db.collection('users').insertOne(members[index], (err, data) => {})

            if (members[index + 1]) {
                setTimeout(() => iterateMembers(index + 1), config.DELAY);
            }
            else {
                client.close();
                return;
            }
        }
        else {
            if (members[index + 1]) {
                setTimeout(() => iterateMembers(index + 1), config.DELAY);
            }
            else {
                client.close();
                db.collection('special').updateOne({ id: 'lastUpdated' }, {$set: {
                    id: 'lastUpdated',
                    timestamp: Date.now()
                }}, { upsert: true }, (err, data) => { })
                return;
            }
        }
        
    }
    iterateMembers(0);
}