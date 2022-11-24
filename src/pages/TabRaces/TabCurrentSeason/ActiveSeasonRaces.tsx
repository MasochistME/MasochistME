import { Race } from '@masochistme/sdk/dist/v1/types';
import { Flex } from 'components';
import { getHumanReadableDate } from 'utils';

type Props = {
	races: Race[];
};

export const ActiveSeasonRaces = (props: Props): JSX.Element => {
	const { races } = props;

	return (
		<Flex column width="100%">
			{races.map(race => (
				<Flex justifyContent="space-evenly">
					<span>{getHumanReadableDate(race.startDate)}</span>
					<span>{race.name}</span>
					<span>{2}</span>
					<span>{2}</span>
					<span>{2}</span>
					<span>{race.type}</span>
					<span>{2}</span>
				</Flex>
			))}
		</Flex>
	);
};
