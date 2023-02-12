import { RacePlayer, RaceType } from '@masochistme/sdk/dist/v1/types';
import styled from 'styled-components';

import { useRaceById } from 'sdk';
import { Flex, Icon, Table, TableCell, TableColumn, Tooltip } from 'components';
import { Podium, WinnerLink } from 'containers';
import { fonts } from 'styles';
import dayjs from 'dayjs';

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
	const { raceData: race } = useRaceById(raceId);
	const leaderboards = race?.leaderboards ?? [];

	const leaderboardsWithPlace = leaderboards.map(
		(p: RacePlayer, place: number) => ({
			...p,
			place: (place + 1) as 1 | 2 | 3,
		}),
	);
	const leaderboardsWithPlacePodium = leaderboardsWithPlace.slice(0, 3);

	const columns: TableColumn<RacePlayer & { place: number }>[] = [
		{
			key: Columns.PLACE,
			title: Columns.PLACE,
			value: (player: RacePlayer & { place: number }) => player.place,
			render: (player: RacePlayer & { place: number }) => (
				<TableCell
					content={<StyledPlayerScore>{player.place}</StyledPlayerScore>}
				/>
			),
			style: { width: '100px' },
		},
		{
			key: Columns.USERNAME,
			title: Columns.USERNAME,
			value: (player: RacePlayer) => String(player.discordId),
			render: (player: RacePlayer) => (
				<TableCell
					isCentered={false}
					content={
						<WinnerLink
							discordId={player.discordId}
							raceId={raceId}
							isCompact
							hasAvatar
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
				<TableCell
					content={
						<StyledPlayerScore>
							{player.score}
							<ScoreDetails player={player} />
						</StyledPlayerScore>
					}
				/>
			),
			style: { width: '100px' },
		});

	if (race?.type === RaceType.TIME_BASED)
		columns.push({
			key: Columns.TIME,
			title: Columns.TIME,
			value: (player: RacePlayer) => String(player.score),
			render: (player: RacePlayer) => (
				<TableCell
					content={
						<StyledPlayerScore>
							{player.score}
							<ScoreDetails player={player} />
						</StyledPlayerScore>
					}
				/>
			),
			style: { width: '100px' },
		});

	return (
		<Flex column width="100%" gap={16}>
			<Podium podium={leaderboardsWithPlacePodium} />
			<Table
				columns={columns}
				dataset={leaderboardsWithPlace}
				rowsPerPage={10}
			/>
		</Flex>
	);
};

const ScoreDetails = ({ player }: { player: RacePlayer }) => (
	<Icon
		icon="CircleInfo"
		hoverText={
			<StyledScoreDetails>
				<li>{getTimeWithMs(player.revealDate)} - reveal time</li>
				<li>{getTimeWithMs(player.startDate)} - start time</li>
				<li>{getTimeWithMs(player.endDate)} - end time</li>
				<li>{getTimeWithMs(player.proofDate)} - proof time</li>
			</StyledScoreDetails>
		}
	/>
);

export const getTimeWithMs = (date: Date | number | null | undefined) => {
	if (date === null) return '—';
	const format = 'H:mm:ss:SSS';
	return <code>{dayjs(date).format(format)}</code>;
};

const StyledPlayerScore = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 8px 32px;
	font-size: 1.3em;
	font-weight: bold;
	font-family: ${fonts.Dosis};
`;

const StyledScoreDetails = styled.ul`
	list-style-type: none;
	margin: 0;
	padding: 0;
`;
