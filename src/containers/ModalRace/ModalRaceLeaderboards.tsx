import { RacePlayer, RaceType } from '@masochistme/sdk/dist/v1/types';
import styled from 'styled-components';

import { useRaceById } from 'sdk';
import {
	ErrorFallback,
	Flex,
	Icon,
	QueryBoundary,
	Table,
	TableCell,
	TableColumn,
} from 'components';
import { Podium, WinnerLink } from 'containers';
import { media } from 'styles';
import dayjs from 'dayjs';
import { getMedal } from 'utils/getMedal';

type Props = {
	raceId?: string | null;
};

enum Columns {
	MEDAL = '🥇',
	PLACE = '',
	USERNAME = 'Username',
	SCORE = 'Score',
	TIME = 'Time',
}

export const ModalRaceLeaderboards = (props: Props) => {
	const columns = Object.values(Columns).map(c => ({
		key: c,
		title: c,
		value: () => '',
		render: () => null,
	}));
	return (
		<QueryBoundary
			fallback={
				<Flex column width="100%" gap={16}>
					<Podium.Skeleton />
					<Table.Skeleton columns={columns} style={{ margin: '0.6rem 0' }} />
				</Flex>
			}
			errorFallback={<ErrorFallback />}>
			<LeaderboardsBoundary {...props} />
		</QueryBoundary>
	);
};

const LeaderboardsBoundary = (props: Props) => {
	const { raceId } = props;
	const { raceData: race } = useRaceById(raceId);
	const leaderboards = race?.leaderboards ?? [];

	const leaderboardsPodium = leaderboards.slice(0, 3);

	const columns: TableColumn<RacePlayer>[] = [
		{
			key: Columns.MEDAL,
			title: Columns.MEDAL,
			value: (player: RacePlayer) => player?.place ?? 0,
			render: (player: RacePlayer) => (
				<span style={{ width: '5rem' }}>{getMedal(player?.place)}</span>
			),
			style: { minWidth: '5rem' },
		},
		{
			key: Columns.PLACE,
			title: Columns.PLACE,
			value: (player: RacePlayer) => player?.place ?? 0,
			render: (player: RacePlayer) => (
				<TableCell
					content={
						<StyledPlayerScore>{player?.place ?? '—'}</StyledPlayerScore>
					}
				/>
			),
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
					justifyContent="flex-end"
					content={
						<StyledPlayerScore>
							{player.score}
							<ScoreDetails player={player} />
						</StyledPlayerScore>
					}
				/>
			),
			style: { width: '10rem' },
		});

	if (race?.type === RaceType.TIME_BASED)
		columns.push({
			key: Columns.TIME,
			title: Columns.TIME,
			value: (player: RacePlayer) => String(player.score),
			render: (player: RacePlayer) => (
				<TableCell
					justifyContent="flex-end"
					content={
						<StyledPlayerScore>
							{player.score}
							<ScoreDetails player={player} />
						</StyledPlayerScore>
					}
				/>
			),
			style: { width: '10rem' },
		});

	return (
		<Flex column width="100%" gap={16}>
			<Podium podium={leaderboardsPodium} />
			<Table columns={columns} dataset={leaderboards} rowsPerPage={10} />
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
	flex-direction: row;
	align-items: center;
	gap: var(--size-4);
	padding: var(--size-8);
	font-size: var(--font-size-16);
	font-family: var(--font-dosis);
	font-weight: bold;
	@media (max-width: ${media.tablets}) {
		padding: var(--size-8);
	}
`;

const StyledScoreDetails = styled.ul`
	list-style-type: none;
	margin: 0;
	padding: 0;
`;
