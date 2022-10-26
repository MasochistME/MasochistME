import styled from 'styled-components';
import dayjs from 'dayjs';
import { PatronTier } from '@masochistme/sdk/dist/v1/types';

import { usePatreonTiers } from 'sdk';
import { colors } from 'styles/theme/themeOld';
import { Flex, Icon, Tooltip } from 'components';

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
		const color = `${colors[`tier${patron.tier}`] ?? colors.superDarkGrey}`;
		return (
			<Tooltip
				content={`This member is ${patron?.description.toUpperCase()} tier supporter.`}>
				<PatronIcon icon="Donation" patronTierColor={color} />
			</Tooltip>
		);
	}
	return <LeaderboardsMemberIconDummy />;
};

const PatronIcon = styled(Icon)<{ patronTierColor: string }>`
	cursor: help;
	color: ${colors.black};
	text-shadow: ${({ patronTierColor }) => patronTierColor} 0 0 10px;
	font-size: ${ICON_SIZE};
`;

export const LeaderboardsMemberIconPrivate = () => {
	const style = {
		color: colors.lightRed,
		cursor: 'help',
		opacity: '0.8',
		fontSize: ICON_SIZE,
	};
	return (
		<Tooltip content="This user has their profile set to private.">
			<Icon icon="WarningTriangle" {...style} />
		</Tooltip>
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
		<Tooltip
			content={
				<Flex column>
					<span>This member was last updated {lastUpdate}.</span>
				</Flex>
			}>
			<Icon icon="WarningCircle" {...style} />
		</Tooltip>
	);
};

export const LeaderboardsMemberIconDummy = () => {
	const style = { color: 'transparent', fontSize: ICON_SIZE };
	return <Icon icon="WarningCircle" {...style} />;
};
