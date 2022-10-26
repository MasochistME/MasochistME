import styled from 'styled-components';
import dayjs from 'dayjs';
import { PatronTier } from '@masochistme/sdk/dist/v1/types';

import { usePatreonTiers } from 'sdk';
import { colors } from 'styles/theme/themeOld';
import { Flex, Icon, Size } from 'components';

const ICON_SIZE = '1.2em';

type Props = {
	patronTier?: PatronTier | null;
};
export const LeaderboardsMemberIconPatron = (props: Props) => {
	const { patronTier } = props;
	const { patreonTiersData } = usePatreonTiers();

	const patron = patreonTiersData.find(
		patreonTier => patreonTier.id === patronTier,
	) ?? {
		description: 'Unknown',
		tier: null,
	};

	if (patronTier) {
		// @ts-ignore:next-line
		const color = colors[`tier${patron.tier}`] ?? colors.superDarkGrey;
		console.log(color);
		return (
			<Icon
				size={Size.TINY}
				hoverText={`This member is ${patron?.description.toUpperCase()} tier supporter.`}
				icon="Donation"
				cursor="help"
				color={colors.black}
				shadowColor={color}
			/>
		);
	}
	return <LeaderboardsMemberIconDummy />;
};

export const LeaderboardsMemberIconPrivate = () => {
	const style = {
		color: colors.lightRed,
		cursor: 'help',
		opacity: '0.8',
		fontSize: ICON_SIZE,
	};
	return (
		<Icon
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
		color: '#a39969',
		cursor: 'help',
		opacity: '0.8',
		fontSize: ICON_SIZE,
	};

	const lastUpdate =
		new Date(lastUpdated ?? 0).getTime() === 0
			? 'never'
			: dayjs(lastUpdated).fromNow();

	return (
		<Icon
			hoverText={`This member was last updated ${lastUpdate}.`}
			icon="WarningCircle"
			{...style}
		/>
	);
};

export const LeaderboardsMemberIconDummy = () => {
	const style = { color: 'transparent', fontSize: ICON_SIZE };
	return <Icon icon="WarningCircle" {...style} />;
};
