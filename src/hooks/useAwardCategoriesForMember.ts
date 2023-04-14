import { Award, AwardCategory } from '@masochistme/sdk/dist/v1/types';
import { useAwards, useMemberAwards } from 'sdk';

/**
 * This code is going to be ugly as hell but I don't want to spend any more time on it
 * In short: if award has any of its children unlocked, it should show the highest
 * tier children's image instead of its own
 */
export const useAwardCategoriesForMember = (memberId: string) => {
	const { awardsData } = useAwards({ sort: { category: 'desc' } });
	const { memberAwardsData = [] } = useMemberAwards(memberId);

	const getCategoryAwards = (category: AwardCategory & { awards: Award[] }) => {
		return category.awards.map(award => {
			// Getting all children of an award.
			// If award has no children, we treat it as its own child for simplicity
			const awardChildren = (
				award.children?.length ? award.children : [award]
			) as Award[]; // TODO Those types are incorrect - children are typed as String despite them being Award here

			// Getting IDs of all awards that the member unlocked.
			const memberUnlockedAwardsIds = memberAwardsData.map(
				memberAward => memberAward.awardId,
			);

			// Getting the highest unlocked tier of this particular award.
			// Children are always ordered by tier so the first unlocked child is the highest tier
			const highestTierUnlockedAward = awardChildren.find(award =>
				memberUnlockedAwardsIds.includes(String(award._id)),
			);

			const awardImg = highestTierUnlockedAward?.img ?? award.img;
			const fixedAward = {
				...award,
				img: awardImg,
				isUnlocked: !!highestTierUnlockedAward,
			};
			return fixedAward;
		});
	};

	const awardCategories = awardsData.map(category => {
		const categoryAwards = getCategoryAwards(category);
		return {
			...category,
			awards: categoryAwards,
		};
	});

	return awardCategories;
};
