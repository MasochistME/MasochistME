import express from 'express';
import { apiV1Auth } from 'helpers/validate';

export const routerV1 = express.Router();

/***************************
 *         UPDATE         *
 ***************************/

import { updateMember, getUpdateCuratorStatus, updateCurator } from './update';

routerV1.get('/update', getUpdateCuratorStatus);
routerV1.put('/update', updateCurator);
routerV1.put('/members/member/:memberId/update', updateMember);

/******************************
 *         CANDIDATES         *
 ******************************/

import { getCandidateSummary } from './candidates';

// TODO hide this behind CAPTCHA
routerV1.post('/candidate/scout', getCandidateSummary);

/***************************
 *         MEMBERS         *
 ***************************/

import {
  getMembersList,
  getMemberById,
  updateMemberById,
  getMemberGameList,
  getMemberAchievementList,
  getMemberBadgeList,
  giveBadgeToMemberById,
  revokeBadgeFromMemberById,
  getMemberAwardList,
  giveAwardToMemberById,
  revokeAwardFromMemberById,
} from './members';

routerV1.post('/members/list', getMembersList);
routerV1.get('/members/member/:memberId', getMemberById);
routerV1.put('/members/member/:memberId', apiV1Auth, updateMemberById);

// Member games
routerV1.post('/members/member/:memberId/games/list', getMemberGameList);
routerV1.post(
  '/members/member/:memberId/achievements/list',
  getMemberAchievementList,
);

// Member badges
routerV1.post('/members/member/:memberId/badges/list', getMemberBadgeList);
routerV1.post(
  '/members/member/:memberId/badges/badge/:badgeId',
  apiV1Auth,
  giveBadgeToMemberById,
);
routerV1.delete(
  '/members/member/:memberId/badges/badge/:badgeId',
  apiV1Auth,
  revokeBadgeFromMemberById,
);

// Member awards
routerV1.post('/members/member/:memberId/awards/list', getMemberAwardList);
routerV1.post(
  '/members/member/:memberId/awards/award/:awardId',
  apiV1Auth,
  giveAwardToMemberById,
);
routerV1.delete(
  '/members/member/:memberId/awards/award/:awardId',
  apiV1Auth,
  revokeAwardFromMemberById,
);

/********************************
 *         LEADERBOARDS         *
 ********************************/

import {
  getLeaderboardsMembersList,
  getLeaderboardsGamesList,
  getMemberLeaderboardsPositionById,
} from './leaderboards';

routerV1.post('/leaderboards/members/list', getLeaderboardsMembersList);
routerV1.post('/leaderboards/games/list', getLeaderboardsGamesList);
routerV1.get(
  '/leaderboards/member/:memberId',
  getMemberLeaderboardsPositionById,
);

/*************************
 *         GAMES         *
 *************************/

import {
  getGamesList,
  getBadgesByGameIdList,
  getGameCompletionList,
} from './games';

routerV1.post('/games/list', getGamesList);
routerV1.post('/games/game/:gameId/badges/list', getBadgesByGameIdList);
routerV1.post('/games/completion/list', getGameCompletionList);

/**************************
 *         BADGES         *
 **************************/

import {
  getBadgesList,
  createBadge,
  getBadgeById,
  updateBadgeById,
  deleteBadgeById,
} from './badges';

routerV1.post('/badges/list', getBadgesList);
routerV1.post('/badges', apiV1Auth, createBadge);
routerV1.get('/badges/badge/:badgeId', getBadgeById);
routerV1.put('/badges/badge/:badgeId', apiV1Auth, updateBadgeById);
routerV1.delete('/badges/badge/:badgeId', apiV1Auth, deleteBadgeById);

/**************************
 *         AWARDS         *
 **************************/

import {
  getAwardsList,
  createAward,
  getAwardById,
  updateAwardById,
  deleteAwardById,
} from './awards';

routerV1.post('/awards/list', getAwardsList);
routerV1.post('/awards', apiV1Auth, createAward);
routerV1.get('/awards/award/:awardId', getAwardById);
routerV1.put('/awards/award/:awardId', apiV1Auth, updateAwardById);
routerV1.delete('/awards/award/:awardId', apiV1Auth, deleteAwardById);

/*************************
 *         LOGS         *
 *************************/

import { getLogList, createLog } from './logs';

routerV1.post('/logs/list', getLogList);
routerV1.post('/logs', apiV1Auth, createLog);

/*************************
 *         TIERS         *
 *************************/

import { getTiersList } from './tiers';

routerV1.post('/tiers/list', getTiersList);

/*************************
 *         RACES         *
 *************************/

import {
  createRace,
  getRaceById,
  updateRaceById,
  deleteRaceById,
  getRaceList,
  getActiveRace,
} from './race';

routerV1.post('/races', apiV1Auth, createRace);
routerV1.get('/races/race/:raceId', getRaceById);
routerV1.put('/races/race/:raceId', apiV1Auth, updateRaceById);
routerV1.delete('/races/race/:raceId', apiV1Auth, deleteRaceById);
routerV1.post('/races/list', getRaceList);
routerV1.get('/races/active', getActiveRace);

/*********************************
 *       RACE PARTICIPANTS       *
 *********************************/

import {
  getRaceParticipantById,
  joinRaceByParticipantId,
  updateRaceByParticipantId,
  getRaceParticipantsList,
} from './racePlayers';

routerV1.get(
  '/races/race/:raceId/participants/participant/:participantId',
  getRaceParticipantById,
);
routerV1.post(
  '/races/race/:raceId/participants/participant/:participantId',
  apiV1Auth,
  joinRaceByParticipantId,
);
routerV1.put(
  '/races/race/:raceId/participants/participant/:participantId',
  apiV1Auth,
  updateRaceByParticipantId,
);
routerV1.post('/races/race/:raceId/participants/list', getRaceParticipantsList);

/***************************
 *         SEASONS         *
 ***************************/

import {
  createSeason,
  updateSeasonById,
  getSeasonsList,
  getSeasonById,
  getSeasonLeaderboardsById,
} from './seasons';

routerV1.post('/seasons', apiV1Auth, createSeason);
routerV1.get('/seasons/season/:seasonId', getSeasonById);
routerV1.put('/seasons/season/:seasonId', apiV1Auth, updateSeasonById);
routerV1.get(
  '/seasons/season/:seasonId/leaderboards',
  getSeasonLeaderboardsById,
);
routerV1.post('/seasons/list', getSeasonsList);

/****************************
 *         FEATURED         *
 ****************************/

import {
  createFeatured,
  getFeaturedList,
  updateFeaturedById,
  deleteFeaturedById,
} from './featured';

routerV1.post('/featured', apiV1Auth, createFeatured);
routerV1.post('/featured/list', getFeaturedList);
routerV1.put('/featured/:featuredId', apiV1Auth, updateFeaturedById);
routerV1.delete('/featured/:featuredId', apiV1Auth, deleteFeaturedById);

/****************************
 *         PATRONS         *
 ****************************/

import {
  createPatron,
  getPatronsList,
  getPatreonTierList,
  updatePatronById,
} from './patrons';

routerV1.post('/patrons', apiV1Auth, createPatron);
routerV1.post('/patrons/list', getPatronsList);
routerV1.get('/patrons/tiers/list', getPatreonTierList);
routerV1.put('/patrons/patron/:patronId', apiV1Auth, updatePatronById);
