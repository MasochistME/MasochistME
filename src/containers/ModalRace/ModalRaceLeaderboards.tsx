import { RacePlayer, RaceType } from '@masochistme/sdk/dist/v1/types';

import { useRaceById } from 'sdk';
import { Flex, Spinner, Table, TableCell, TableColumn } from 'components';
import { Podium, WinnerLink } from 'containers';

type Props = {
	raceId?: string | null;
};

enum Columns {
	PLACE = 'Place',
	USERNAME = 'Username',
	SCORE = 'Score',
	TIME = 'Time',
	DNF = 'DNF',
	DISQUALIFIED = 'Disqualified',
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
	const leaderboardsWithPlacePodium = leaderboardsWithPlace.splice(0, 3);

	const columns: TableColumn<RacePlayer & { place: number }>[] = [
		{
			key: Columns.PLACE,
			title: Columns.PLACE,
			value: (player: RacePlayer & { place: number }) => player.place,
			render: (player: RacePlayer & { place: number }) => (
				<TableCell content={String(player.place)} />
			),
			style: { width: '100px' },
		},
		{
			key: Columns.USERNAME,
			title: Columns.USERNAME,
			value: (player: RacePlayer) => String(player.discordId),
			render: (player: RacePlayer) => (
				<TableCell
					content={
						<WinnerLink
							discordId={player.discordId}
							raceId={raceId}
							isCompact
						/>
					}
				/>
			),
			style: { width: '100%', maxWidth: '80%' },
		},
	];

	if (race?.type === RaceType.SCORE_BASED)
		columns.push({
			key: Columns.SCORE,
			title: Columns.SCORE,
			value: (player: RacePlayer) => String(player.score),
			render: (player: RacePlayer) => (
				<TableCell content={String(player.score)} />
			),
			style: { width: '100px' },
		});

	if (race?.type === RaceType.TIME_BASED)
		columns.push({
			key: Columns.TIME,
			title: Columns.TIME,
			value: (player: RacePlayer) => String(player.score),
			render: (player: RacePlayer) => (
				<TableCell content={String(player.score)} />
			),
			style: { width: '100px' },
		});

	return (
		<Flex column width="100%" gap={16}>
			{isLoading && <Spinner />}
			{isFetched && (
				<>
					<Podium podium={leaderboardsWithPlacePodium} />
					<Table columns={columns} dataset={leaderboardsWithPlace} />
				</>
			)}
		</Flex>
	);
};
