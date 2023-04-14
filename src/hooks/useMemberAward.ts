import { useAward, useMemberAwards } from 'sdk';

export const useMemberAward = (awardId: string, steamId: string) => {
	const { awardData } = useAward(awardId);
	const { memberAwardsData } = useMemberAwards(steamId);

	console.log(awardData);
	console.log(memberAwardsData);

	return { awardData, memberAwardsData };
};
