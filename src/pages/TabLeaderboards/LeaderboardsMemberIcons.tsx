import styled from 'styled-components';
import dayjs from 'dayjs';
import { PatreonTier, PatronTier } from '@masochistme/sdk/dist/v1/types';

import { usePatreonTiers } from 'sdk';
import { colors } from 'shared/theme';
import { Flex, Tooltip } from 'components';

const ICON_SIZE = '1em';

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
		const color = `${colors[`tier${patronTier}`] ?? colors.superDarkGrey}77`;
		return (
			<Tooltip
				content={`This member is ${patron?.description.toUpperCase()} tier supporter.`}>
				<PatronIcon className="fas fa-heart" style={{ color }} />
			</Tooltip>
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
		color: '#cec25a',
		cursor: 'help',
		opacity: '0.8',
		fontSize: ICON_SIZE,
	};
	const date = dayjs(lastUpdated).fromNow();

	return (
		<Tooltip
			content={
				<Flex column>
					<span>This member was last updated {date}.</span>
					<span>Their data is most likely outdated.</span>
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

const PatronIcon = styled.i`
	cursor: help;
	font-size: ${ICON_SIZE};
`;
