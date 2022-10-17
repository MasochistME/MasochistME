import { Tier } from '@masochistme/sdk/dist/v1/types';

export const getTierIcon = (
	scoreID: string | number,
	tiers: Tier[],
): string => {
	return (
		tiers?.find((tier: Tier) => tier.id === scoreID)?.icon ?? 'fas fa-spinner'
	);
};
