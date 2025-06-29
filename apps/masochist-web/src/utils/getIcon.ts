import { Race, RaceType, Tier } from '@masochistme/sdk/dist/v1/types';
import { IconType } from 'components';

export const getTierIcon = (
  scoreID: string | number,
  tiers: Tier[],
): IconType => {
  return (tiers?.find((tier: Tier) => tier.id === scoreID)?.icon ??
    'Spin') as IconType;
};

export const getRaceTypeIcon = (race: Race): IconType => {
  const icon = race.type === RaceType.SCORE_BASED ? 'Gauge' : 'ClockEmpty';
  return icon as IconType;
};
