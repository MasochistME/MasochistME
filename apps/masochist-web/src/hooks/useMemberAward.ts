import { Award, MemberAward } from '@masochistme/sdk/dist/v1/types';
import { useAward, useAwards, useMemberAwards } from 'sdk';
import { NO_IMG } from 'utils';

export const useAwardCategoriesForMember = (memberId: string) => {
  const { awardsData } = useAwards({ sort: { category: 'desc' } });
  const { memberAwardsData = [] } = useMemberAwards(memberId);

  const awardCategories = awardsData.map(category => {
    const categoryAwards = category.awards.map(originalAward => {
      const { award, isUnlocked } = getAwardWithUnlockStatus(
        originalAward,
        memberAwardsData,
      );
      return { ...award, isUnlocked };
    });
    return {
      ...category,
      awards: categoryAwards,
    };
  });

  return awardCategories;
};

export const useMemberAward = (awardId: string, steamId: string) => {
  const { awardData } = useAward(awardId);
  const { memberAwardsData } = useMemberAwards(steamId);

  const { award, isUnlocked, timesUnlocked } = getAwardWithUnlockStatus(
    awardData,
    memberAwardsData,
  );
  const allMemberAwards = memberAwardsData.filter(
    award => award.awardId === awardId,
  );

  return {
    award,
    allMemberAwards,
    memberAwardsData,
    isUnlocked,
    timesUnlocked,
  };
};

/**
 * This code is going to be ugly as hell but I don't want to spend any more time on it :c
 * In short: if award has any of its children unlocked, it should show the highest
 * tier children's image instead of its own.
 * TODO Consider moving this logic to backend
 */
const getAwardWithUnlockStatus = (
  originalAward?: Award,
  memberAwards: MemberAward[] = [],
) => {
  const awardId = String(originalAward?._id);
  const timesUnlocked =
    memberAwards.filter(memberAward => memberAward.awardId === awardId)
      ?.length ?? 0;

  // Getting all children of an award.
  // If award has no children, we treat it as its own child for simplicity
  const awardChildren = (
    originalAward?.children?.length ? originalAward.children : [originalAward]
  ) as Award[]; // TODO Those types are incorrect - children are typed as String despite them being Award here

  // Getting IDs of all awards that the member unlocked.
  const memberUnlockedAwardsIds = memberAwards.map(
    memberAward => memberAward.awardId,
  );

  // Getting the highest unlocked tier of this particular award.
  // Children are always ordered by tier so the first unlocked child is the highest tier
  const highestTierUnlockedAward = awardChildren.find(award =>
    memberUnlockedAwardsIds.includes(String(award._id)),
  );
  const isUnlocked = !!highestTierUnlockedAward;
  const awardImg =
    highestTierUnlockedAward?.img ?? originalAward?.img ?? NO_IMG;
  const award = {
    ...originalAward,
    img: awardImg,
  } as Award;

  return { award, isUnlocked, timesUnlocked };
};
