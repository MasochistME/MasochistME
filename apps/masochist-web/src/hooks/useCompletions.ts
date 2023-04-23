import { useMemo } from 'react';
import { Member, MemberGame, Game } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useCuratorMembers, useGameCompletions } from 'sdk';

export type GameCompletion = Omit<
	MemberGame,
	'_id' | 'memberId' | 'playtime'
> & {
	member: Member;
	trophy: null;
};

export const useGameCompletion = (gameId: number) => {
	const { gamesData } = useCuratedGames();
	const { membersData } = useCuratorMembers();
	const { completionsData } = useGameCompletions({
		filter: { gameId },
	});

	const gameCompletions = useMemo(() => {
		return completionsData
			.map((completion: MemberGame) => {
				const member = membersData.find(
					(m: Member) => m.steamId === completion.memberId,
				);
				if (!member) return;
				return {
					member: member,
					gameId: completion.gameId,
					mostRecentAchievementDate: completion.mostRecentAchievementDate,
					completionPercentage: completion.completionPercentage,
					playTime: completion.playTime,
					trophy: null,
				} as unknown as GameCompletion;
			})
			.filter(Boolean)
			.sort(
				(completionA, completionB) =>
					(completionB?.completionPercentage ?? 0) -
					(completionA?.completionPercentage ?? 0),
			);
	}, [gamesData, membersData, completionsData]) as GameCompletion[];

	return { gameCompletions };
};

export type MemberCompletion = Omit<MemberGame, '_id' | 'playtime'> & {
	game: Game;
	trophy: null;
};
export const useMemberCompletion = (memberId: string) => {
	const { gamesData } = useCuratedGames();
	const { membersData } = useCuratorMembers();
	const { completionsData } = useGameCompletions({
		filter: { memberId },
	});

	const memberCompletions = useMemo(() => {
		return completionsData
			.map((completion: MemberGame) => {
				const game = gamesData.find((g: Game) => g.id === completion.gameId);
				if (!game) return;

				const gameAchievementsTotal = game?.achievementsTotal ?? 0;
				const memberGameAchievementsUnlocked =
					completion.achievementsUnlocked ?? 0;
				const completionPercentage = Math.round(
					(100 * memberGameAchievementsUnlocked) / gameAchievementsTotal,
				);
				return {
					memberId,
					game,
					mostRecentAchievementDate: completion.mostRecentAchievementDate,
					completionPercentage: Number.isNaN(completionPercentage)
						? 0
						: completionPercentage,
					trophy: null,
				} as unknown as MemberCompletion;
			})
			.filter(Boolean)
			.sort(
				(completionA, completionB) =>
					(completionB?.completionPercentage ?? 0) -
					(completionA?.completionPercentage ?? 0),
			);
	}, [gamesData, membersData, completionsData]) as MemberCompletion[];

	return { memberCompletions };
};
