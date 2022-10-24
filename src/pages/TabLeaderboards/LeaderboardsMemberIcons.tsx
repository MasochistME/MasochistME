import styled from 'styled-components';
import dayjs from 'dayjs';
import { PatreonTier, PatronTier } from '@masochistme/sdk/dist/v1/types';

import { usePatreonTiers } from 'sdk';
import { colors } from 'shared/theme';
import { Flex, Tooltip } from 'components';

const ICON_SIZE = '1.2em';

type Props = {
	patronTier?: PatronTier | null;
};
export const LeaderboardsMemberIconPatron = (props: Props) => {
	const { patronTier } = props;
	const { patreonTiersData } = usePatreonTiers();

	const patron = patreonTiersData.find(tier => tier.tier === patronTier) ?? {
		description: 'Unknown',
	};

	if (patronTier) {
		// @ts-ignore:next-line
		const color = `${colors[`tier${patronTier}`] ?? colors.superDarkGrey}`;
		return (
			<Tooltip
				content={`This member is ${patron?.description.toUpperCase()} tier supporter.`}>
				<PatronIcon
					className="fa-solid fa-circle-dollar-to-slot"
					patronTierColor={color}
				/>
			</Tooltip>
		);
	}
	return <LeaderboardsMemberIconDummy />;
};

const PatronIcon = styled.i<{ patronTierColor: string }>`
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
			<i className="fas fa-exclamation-triangle" style={style} />
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
			<i className="fas fa-exclamation-circle" style={style} />
		</Tooltip>
	);
};

export const LeaderboardsMemberIconDummy = () => {
	const style = { color: 'transparent', fontSize: ICON_SIZE };
	return <i className="fas fa-exclamation-circle" style={style} />;
};
