import { MemberBadge, Game } from '@masochistme/sdk/dist/v1/types';

import { useAllGames, useBadges, useMemberBadges } from 'sdk';

export const useMemberBadgesFilter = (memberId: string) => {
	const { gamesData: games } = useAllGames();
	const { memberBadgesData = [] } = useMemberBadges(memberId);
	const { badgesData, isLoading, isFetched } = useBadges({
		sort: { points: 'desc' },
	});

	const memberBadges = badgesData.filter(badge => {
		const game = games.find((g: Game) => g.id === badge.gameId);
		const isMemberHasBadge = memberBadgesData.find(
			(mb: MemberBadge) => mb.badgeId === String(badge._id),
		);
		if (!isMemberHasBadge) return false;
		if (!game || game.isCurated || game.isProtected) return true;
		return false;
	});

	return { memberBadges, isLoading, isFetched };
};
