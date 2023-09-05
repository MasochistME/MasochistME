import { Theme } from './theme';

export type AssetTokens = {
  'core-background': string;
  'core-logo': string;
  'core-subheader': string;
};

export const assets: Record<Theme, AssetTokens> = {
  [Theme.ASH]: {
    'core-background': 'https://cdn.masochist.me/assets/bg/bg_ash.jpg',
    'core-logo': 'https://cdn.masochist.me/assets/logo/logo_ash.png',
    'core-subheader': 'https://cdn.masochist.me/assets/sh/sh_ash.png',
  },
  [Theme.MEAT]: {
    'core-background': 'https://cdn.masochist.me/assets/bg/bg_meat.jpg',
    'core-logo': 'https://cdn.masochist.me/assets/logo/logo_meat.png',
    'core-subheader': 'https://cdn.masochist.me/assets/sh/sh_meat.png',
  },
  [Theme.DUST]: {
    'core-background': 'https://cdn.masochist.me/assets/bg/bg_dust.jpg',
    'core-logo': 'https://cdn.masochist.me/assets/logo/logo_dust.png',
    'core-subheader': 'https://cdn.masochist.me/assets/sh/sh_dust.png',
  },
};
