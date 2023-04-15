import { Request, Response } from 'express';
import axios from 'axios';
import { Game, MemberGame, Tier } from '@masochistme/sdk/dist/v1/types';

import { mongoInstance } from 'index';
import { log } from 'helpers/log';
import {
  getMemberSteamAchievements,
  getMemberSteamGames,
} from 'router/v1/update/updateMember/updateMember';
import { validateSteamUrl } from 'helpers/validate';

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
  try {
    // Validate provided Steam name.
    const { steamUrl } = req.body;

    const { hasError, error } = validateSteamUrl(steamUrl);

    if (hasError) {
      res.status(400).send({ error });
      return;
    }

    // Get a list of curated games.
    const { db } = mongoInstance.getDb();
    const collectionGames = db.collection<Game>('games');
    const curatedGames: Game[] = [];
    const cursorGames = collectionGames.find({
      $or: [{ isCurated: true }, { isProtected: true }],
    });
    await cursorGames.forEach((el: Game) => {
      curatedGames.push(el);
    });

    const userId = await getIdFromUrl(steamUrl);

    // Scrape a list of scouted Steam user's perfected games.
    const candidateSteamGames = await getMemberSteamGames(userId, curatedGames);

    if (!candidateSteamGames?.length) {
      res.status(403).send({
        error:
          "This user's Steam profile is private or their games' data is hidden.",
      });
      return;
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

    // Get a list of MasochistME tiers
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

    res.status(200).send(perfectGamesData);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

const getIdFromUrl = async (steamUrl?: string) => {
  const normalUrl = 'https://steamcommunity.com/profiles/';
  const vanityUrl = 'https://steamcommunity.com/id/';

  if (steamUrl?.includes(normalUrl)) {
    const id = steamUrl.replace(normalUrl, '');
    return id;
  }

  const vanityName = steamUrl?.replace(vanityUrl, '');
  const idUrl = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001';
  const idData = await axios.get(idUrl, {
    params: {
      key: process.env.STEAM_KEY,
      vanityurl: vanityName,
    },
  });
  return idData?.data?.response?.steamid;
};
