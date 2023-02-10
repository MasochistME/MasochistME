import { Request, Response } from 'express';
import axios from 'axios';
import { Game, Tier } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';
import { MemberSteamGameFallback } from 'router/v1/update/types';

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
    const { steamName } = req.params;

    const error =
      'Please enter an account name that is at least 3 characters long and uses only a-z, A-Z, 0-9 or _ characters.';
    const steamNameValidator = new RegExp(/^[a-zA-Z0-9_]*$/i);
    const hasError =
      !steamName || steamName.length < 3 || !steamNameValidator.test(steamName);

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

    // Scrape a list of scouted Steam user's perfected games.
    const candidateUrl = `https://steamcommunity.com/id/${steamName}/games?tab=perfect`;
    const perfectGamesDataRaw = (await axios.get(candidateUrl))?.data ?? '{}';

    if (
      perfectGamesDataRaw.includes('The specified profile could not be found.')
    ) {
      res.status(404).send({
        error: 'User with this Steam name does not exist.',
      });
      return;
    }
    const profileRegex = new RegExp(/(?<=var rgGames = )(.*)(?=[}}])/i);
    // Important - this can return undefined, if user privated only their game list
    // Handle this by returning an info about it
    const perfectGamesDataMatched = profileRegex.exec(perfectGamesDataRaw)?.[0];
    const perfectGamesDataFixed = perfectGamesDataMatched
      ? perfectGamesDataMatched + '}]'
      : '[]';

    if (!perfectGamesDataMatched) {
      res.status(403).send({
        error:
          "This user's Steam profile is private or their games' data is hidden.",
      });
      return;
    }

    const perfectGamesDataParsed: MemberSteamGameFallback[] = JSON.parse(
      perfectGamesDataFixed,
    );

    // Get a list of MasochistME tiers
    const collectionTiers = db.collection<Tier>('tiers');
    const tiers: Tier[] = [];
    const cursorTiers = collectionTiers.find();
    await cursorTiers.forEach((el: Tier) => {
      tiers.push(el);
    });

    const perfectGamesData = perfectGamesDataParsed
      .map(game => {
        const curatedGame = curatedGames.find(g => g.id === game.appid);
        if (!curatedGame) return null;
        const pts =
          tiers.find(tier => tier.id === curatedGame.tier)?.score ?? 0;
        return {
          id: curatedGame.id,
          title: curatedGame.title,
          pts,
        };
      })
      .filter(Boolean);

    res.status(200).send(perfectGamesData);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
