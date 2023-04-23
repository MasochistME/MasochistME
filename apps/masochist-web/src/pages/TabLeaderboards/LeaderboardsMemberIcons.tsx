import { useMemo } from 'react';
import dayjs from 'dayjs';
import { PatronTier } from '@masochistme/sdk/dist/v1/types';

import { usePatreonTiers } from 'sdk';
import { Icon, Size } from 'components';
import { useTheme, ColorTokens } from 'styles';

type Props = {
	patronTier?: PatronTier | null;
};
export const LeaderboardsMemberIconPatron = (props: Props) => {
	const { patronTier } = props;
	const { colorTokens } = useTheme();
	const { patreonTiersData } = usePatreonTiers();

	const patron = useMemo(() => {
		return (
			patreonTiersData.find(patreonTier => patreonTier.id === patronTier) ?? {
				description: 'Unknown',
				tier: null,
			}
		);
	}, [patreonTiersData, patronTier]);

	if (patronTier) {
		// @ts-ignore
		const color = (colorTokens[`semantic-color--tier-${patron.tier}`] ??
			colorTokens['core-secondary-bg']) as ColorTokens;
		return (
			<Icon
				size={2}
				hoverText={`This member is ${patron?.description.toUpperCase()} tier supporter.`}
				icon="Donation"
				cursor="help"
				color={colorTokens['common-color--black']}
				shadowColor={color}
			/>
		);
	}
	return <LeaderboardsMemberIconDummy />;
};

export const LeaderboardsMemberIconPrivate = () => {
	const { colorTokens } = useTheme();
	const style = {
		color: colorTokens['semantic-color--error-strong'],
		cursor: 'help',
		opacity: '0.8',
	};
	return (
		<Icon
			size={Size.MICRO}
			hoverText="This user has their profile set to private."
			icon="WarningTriangle"
			{...style}
		/>
	);
};

export const LeaderboardsMemberIconOutdated = ({
	lastUpdated,
}: {
	lastUpdated?: number | Date;
}) => {
	const style = {
		cursor: 'help',
		opacity: '0.8',
	};

	const lastUpdate =
		new Date(lastUpdated ?? 0).getTime() === 0
			? 'never'
			: dayjs(lastUpdated).fromNow();

	return (
		<Icon
			size={Size.MICRO}
			hoverText={`This member was last updated ${lastUpdate}.`}
			icon="WarningCircle"
			{...style}
		/>
	);
};

export const LeaderboardsMemberIconDummy = () => {
	const style = { color: 'transparent' };
	return <Icon icon="WarningCircle" size={2} {...style} />;
};
