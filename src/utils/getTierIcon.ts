import { IconType } from 'components';
import { Tier } from '@masochistme/sdk/dist/v1/types';

export const getTierIcon = (
	scoreID: string | number,
	tiers: Tier[],
): IconType => {
	return (tiers?.find((tier: Tier) => tier.id === scoreID)?.icon ??
		'Spin') as IconType;
};
