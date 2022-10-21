import styled from 'styled-components';
import dayjs from 'dayjs';

import { colors } from 'shared/theme';
import { Flex, Tooltip } from 'components';

const ICON_SIZE = '1em';

export const LeaderboardsMemberIconPatron = ({
	patreonTier,
}: {
	patreonTier: any;
}) => {
	const patron = {
		description: 'Patreon tier: TODO - this must be taken from SDK',
	};

	if (patreonTier) {
		// @ts-ignore:next-line
		const color = `${colors[`tier${patreonTier}`] ?? colors.superDarkGrey}77`;
		return (
			<Tooltip content={patron.description.toUpperCase()}>
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
		color: '#fdc000',
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
