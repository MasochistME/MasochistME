import { RacePlayer } from '@masochistme/sdk/dist/v1/types';

import { useRaceById } from 'sdk';
import { Flex, Spinner, Table, TableCell, TableColumn } from 'components';
import { WinnerLink } from 'containers';

type Props = {
	raceId?: string | null;
};

enum Columns {
	PLACE = 'place',
	USERNAME = 'username',
	SCORE = 'score',
	DNF = 'dnf',
	DISQUALIFIED = 'disqualified',
}

export const ModalRaceLeaderboards = (props: Props) => {
	const { raceId } = props;
	const { raceData: race, isLoading, isFetched } = useRaceById(raceId);
	const leaderboards = race?.leaderboards ?? [];

	const leaderboardsWithPlace = leaderboards.map(
		(p: RacePlayer, place: number) => ({
			...p,
			place: place + 1,
		}),
	);

	const columns: TableColumn<RacePlayer & { place: number }>[] = [
		{
			key: Columns.PLACE,
			title: Columns.PLACE,
			value: (player: RacePlayer & { place: number }) => player.place,
			render: (player: RacePlayer & { place: number }) => (
				<TableCell content={String(player.place)} />
			),
		},
		{
			key: Columns.USERNAME,
			title: Columns.USERNAME,
			value: (player: RacePlayer) => String(player.discordId),
			render: (player: RacePlayer) => (
				<TableCell
					content={<WinnerLink discordId={player.discordId} isCompact />}
				/>
			),
		},
		{
			key: Columns.SCORE,
			title: Columns.SCORE,
			value: (player: RacePlayer) => String(player.score),
			render: (player: RacePlayer) => (
				<TableCell content={String(player.score)} />
			),
		},
		// {
		// 	key: Columns.DNF,
		// 	title: Columns.DNF,
		// 	value: (player: RacePlayer) => String(player.dnf),
		// 	render: (player: RacePlayer) => (
		// 		<TableCell content={String(player.dnf)} />
		// 	),
		// },
		// {
		// 	key: Columns.DISQUALIFIED,
		// 	title: Columns.DISQUALIFIED,
		// 	value: (player: RacePlayer) => String(player.disqualified),
		// 	render: (player: RacePlayer) => (
		// 		<TableCell content={String(player.disqualified)} />
		// 	),
		// },
	];

	return (
		<Flex width="100%">
			{isLoading && <Spinner />}
			{isFetched && (
				<Table
					columns={columns}
					dataset={leaderboardsWithPlace}
					rowsPerPage={10}
				/>
			)}
		</Flex>
	);
};
