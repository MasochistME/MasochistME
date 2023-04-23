import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { Game, MemberGame, Tier } from '@masochistme/sdk/dist/v1/types';

import { mongoInstance } from 'index';
import { log } from 'helpers/log';
import { updateQueue } from 'router/v1/update/updateQueue';
import {
  getMemberSteamAchievements,
  getMemberSteamGames,
} from 'router/v1/update/updateMember/updateMember';
import { validateSteamUrl } from 'helpers/validate';
import { MemberSteam } from 'router/v1/update/types';

/**
 * Returns a small summary of any requested Steam member.
 * @param req Request
 * @param res Response
 * @return void
 */
export const getCandidateSummary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { steamUrl } = req.body;
  const userId = await getIdFromUrl(steamUrl);

  try {
    log.INFO(`--> [SCOUT] candidate ${userId} [START]`);
    /**
     * First, we start with validating provided Steam name.
     */
    const { hasError, error } = validateSteamUrl(steamUrl);

    if (hasError) {
      res.status(400).send({ error });
      return;
    }

    /**
     * Check if the candidate already figures in the database.
     * If yes: return the cached data.
     */
    const { db } = mongoInstance.getDb();
    const collectionCandidates = db.collection('candidates');
    const oldCandidateData = await collectionCandidates.findOne({
      steamId: userId,
    });

    if (oldCandidateData) {
      res.status(200).send(oldCandidateData);
      log.INFO(`--> [SCOUT] returning cached candidate ${userId} [END]`);
      return;
    }

    /**
     * Check if the candidate is already in the process of being scouted.
     * If yes: do not proceed.
     */
    if (updateQueue.CANDIDATE_QUEUE.includes(userId)) {
      res.status(409).send({
        error:
          'This candidate is already being scouted - visit this page again in a few minutes!',
      });
      log.INFO(`--> [SCOUT] candidate ${userId} [ALREADY UPDATING]`);
      return;
    }

    /**
     * Check if the candidate update queue is not too long.
     * If yes: do not proceed.
     */
    if (updateQueue.isCandidateQueueFull()) {
      res.status(429).send({
        error:
          'Too many candidates are being scouted - retry in a few minutes.',
      });
      log.INFO(`--> [SCOUT] candidate ${userId} [QUEUE OVERFLOW]`);
      return;
    }

    /**
     * Add candidate to queue.
     */
    updateQueue.CANDIDATE_QUEUE = [...updateQueue.CANDIDATE_QUEUE, userId];

    /**
     * If no: continue scouting.
     * Get candidate's data from Steam API.
     */
    log.INFO(`--> [SCOUT] user ${userId} --> fetching Steam data...`);
    const memberSteamUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2`;
    let memberSteamData;
    try {
      memberSteamData = await axios.get(memberSteamUrl, {
        params: {
          key: process.env.STEAM_KEY,
          steamids: userId,
        },
      });
    } catch (err) {
      throw new Error('Requested Steam user does not exist.');
    }
    const { personaname, avatarhash }: MemberSteam =
      memberSteamData?.data?.response?.players?.[0] ?? {};

    /**
     * Then, we get a list of curated games.
     */
    const collectionGames = db.collection<Game>('games');
    const curatedGames: Game[] = [];
    const cursorGames = collectionGames.find({
      $or: [{ isCurated: true }, { isProtected: true }],
    });
    await cursorGames.forEach((el: Game) => {
      curatedGames.push(el);
    });

    /**
     * Then, we get a list of scouted Steam user's perfected games.
     */
    const candidateSteamGames = await getMemberSteamGames(userId, curatedGames);

    if (!candidateSteamGames?.length) {
      throw new Error(
        "This user's Steam profile is private or their games' data is hidden.",
      );
    }

    /**
     * Get info about user's achievements.
     * Achievements also give us info about game's completion ratio.
     */
    const newMemberSteamAchievements = await getMemberSteamAchievements(
      userId,
      candidateSteamGames,
    );

    /**
     * Aggregate the Steam game data with its achievement data.
     * This allows us to populate both MemberGames and MemberAchievements databases.
     */
    const candidateGames: Omit<MemberGame, '_id'>[] = candidateSteamGames.map(
      game => {
        const gameStats = newMemberSteamAchievements.find(
          g => g.gameId === game.gameId,
        );
        const {
          completionPercentage = 0,
          achievementsUnlocked = 0,
          mostRecentAchievementDate = new Date(0),
        } = gameStats?.game ?? {};

        return {
          ...game,
          completionPercentage,
          achievementsUnlocked,
          mostRecentAchievementDate,
        };
      },
    );

    /**
     * Get a list of MasochistME tiers and segregate the games to their
     * respective tiers. Assign the point values to them.
     */
    const collectionTiers = db.collection<Tier>('tiers');
    const tiers: Tier[] = [];
    const cursorTiers = collectionTiers.find();
    await cursorTiers.forEach((el: Tier) => {
      tiers.push(el);
    });

    const perfectGamesData = candidateGames
      .map(game => {
        const curatedGame = curatedGames.find(g => g.id === game.gameId);
        if (!curatedGame) return null;
        const pts =
          tiers.find(tier => tier.id === curatedGame.tier)?.score ?? 0;
        return {
          id: curatedGame.id,
          title: curatedGame.title,
          tier: curatedGame.tier,
          pts: game.completionPercentage === 100 ? pts : 0,
        };
      })
      .filter(Boolean);

    /**
     * Save the candidate to database.
     * Candidate's data in database is supposed to expire.
     * TTL to be done.
     */
    const candidateData = {
      steamId: userId,
      name: personaname,
      avatarHash: avatarhash,
      games: perfectGamesData,
      updated: new Date(),
    };
    await collectionCandidates.insertOne(candidateData);

    /**
     * Fin!
     */
    updateQueue.CANDIDATE_QUEUE = updateQueue.CANDIDATE_QUEUE.filter(
      queue => queue !== userId,
    );
    res.status(200).send(candidateData);
  } catch (err: any) {
    log.WARN(err);
    updateQueue.CANDIDATE_QUEUE = updateQueue.CANDIDATE_QUEUE.filter(
      queue => queue !== userId,
    );
    res
      .status(err.status ?? 500)
      .send({ error: err.message ?? 'Internal server error' });
  }
};

/**
 * Gets Steam user's ID from their URL.
 * If the URL provided is vanity URL we get ID from the endpoint.
 * @param steamUrl string
 * @returns SteamID string
 */
const getIdFromUrl = async (steamUrl?: string) => {
  const normalUrl = 'https://steamcommunity.com/profiles/';
  const vanityUrl = 'https://steamcommunity.com/id/';

  if (steamUrl?.includes(normalUrl)) {
    const id = steamUrl.replace(normalUrl, '').replace('/', '');
    return id;
  }

  const vanityName = steamUrl?.replace(vanityUrl, '').replace('/', '');
  const idUrl = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001';
  const idData = await axios.get(idUrl, {
    params: {
      key: process.env.STEAM_KEY,
      vanityurl: vanityName,
    },
  });
  return idData?.data?.response?.steamid;
};
