import { useState } from 'react';
import { Member, SeasonLeaderboardEntry } from '@masochistme/sdk/dist/v1/types';
import styled from 'styled-components';

import {
	Button,
	ErrorFallback,
	Flex,
	Icon,
	QueryBoundary,
	Size,
	Table,
	TableCell,
	TableColumn,
	Tooltip,
} from 'components';
import { WinnerLink } from 'containers';
import { useMixpanel } from 'hooks';
import { useCuratorMembers, useSeasonLeaderboards } from 'sdk';
import { ModalParticipant } from './ModalParticipant';

enum Columns {
	PLACE = '#',
	PARTICIPANT = 'Participant',
	SCORE_BEST = 'Score (best-of)',
	SCORE_ALL = 'Score (all)',
	GOLD = '🥇',
	SILVER = '🥈',
	BRONZE = '🥉',
	PARTICIPATIONS = 'Participations',
	DNF = 'DNF',
	MORE = 'More',
}

type Props = { seasonId: string };
export const SingleSeasonRanking = (props: Props) => {
	const columns = Object.values(Columns).map(c => ({
		key: c,
		title: c,
		value: () => '',
		render: () => null,
	}));
	return (
		<QueryBoundary
			fallback={
				<Table.Skeleton columns={columns} style={{ margin: '0.6rem 0' }} />
			}
			errorFallback={<ErrorFallback />}>
			<RankingBoundary {...props} />
		</QueryBoundary>
	);
};

const RankingBoundary = ({ seasonId }: Props) => {
	const { track } = useMixpanel();
	const { data = [] } = useSeasonLeaderboards({ seasonId });
	const participants = useSeasonParticipants(data);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedParticipant, setSelectedParticipant] =
		useState<SeasonSummary | null>(null);

	const onMoreClick = (participant: SeasonSummary) => {
		if (participant) {
			setIsModalOpen(!isModalOpen);
			setSelectedParticipant(participant);
			track('race.participant.click', {
				participant: participant.member?.name ?? participant.discordId,
			});
		}
	};

	const columns: TableColumn<SeasonSummary>[] = [
		{
			key: Columns.PLACE,
			title: Columns.PLACE,
			value: (_: SeasonSummary, index: number) => Number(index + 1),
			render: (_: SeasonSummary, index: number) => (
				<StyledPlace>{index + 1}</StyledPlace>
			),
		},
		{
			key: Columns.PARTICIPANT,
			title: Columns.PARTICIPANT,
			value: (participant: SeasonSummary) =>
				participant.member?.name?.toLowerCase() ?? participant.discordId,
			render: (participant: SeasonSummary) => (
				<TableCell
					isCentered={false}
					content={
						<WinnerLink discordId={participant.discordId} isCompact hasAvatar />
					}
				/>
			),
			style: { width: '30%' },
		},
		{
			key: Columns.GOLD,
			title: (
				<Tooltip content="Sum of all gold medals earned by this participant">
					<span>{Columns.GOLD}</span>
				</Tooltip>
			),
			value: (participant: SeasonSummary) => participant.allGolds,
			render: (participant: SeasonSummary) => participant.allGolds,
		},
		{
			key: Columns.SILVER,
			title: (
				<Tooltip content="Sum of all silver medals earned by this participant">
					<span>{Columns.SILVER}</span>
				</Tooltip>
			),
			value: (participant: SeasonSummary) => participant.allSilvers,
			render: (participant: SeasonSummary) => participant.allSilvers,
		},
		{
			key: Columns.BRONZE,
			title: (
				<Tooltip content="Sum of all bronze medals earned by this participant">
					<span>{Columns.BRONZE}</span>
				</Tooltip>
			),
			value: (participant: SeasonSummary) => participant.allBronzes,
			render: (participant: SeasonSummary) => participant.allBronzes,
		},
		{
			key: Columns.SCORE_BEST,
			title: (
				<Flex row align justify gap={4}>
					{Columns.SCORE_BEST}
					<Icon
						size={Size.MICRO}
						icon="QuestionCircle"
						hoverText="Final score calculated after discarding 3 worst results"
					/>
				</Flex>
			),
			value: (participant: SeasonSummary) => participant.pointsBest,
			render: (participant: SeasonSummary) => participant.pointsBest,
		},
		{
			key: Columns.SCORE_ALL,
			title: (
				<Flex row align justify gap={4}>
					{Columns.SCORE_ALL}
					<Icon
						size={Size.MICRO}
						icon="QuestionCircle"
						hoverText="Full seasons score counting all season races"
					/>
				</Flex>
			),
			value: (participant: SeasonSummary) => participant.pointsTotal,
			render: (participant: SeasonSummary) => participant.pointsTotal,
		},
		{
			key: Columns.PARTICIPATIONS,
			title: Columns.PARTICIPATIONS,
			value: (participant: SeasonSummary) => participant.participationsTotal,
			render: (participant: SeasonSummary) => participant.participationsTotal,
		},
		{
			key: Columns.DNF,
			title: Columns.DNF,
			value: (participant: SeasonSummary) => participant.dnfsTotal,
			render: (participant: SeasonSummary) => participant.dnfsTotal,
		},
		{
			key: Columns.MORE,
			title: Columns.MORE,
			value: () => 0,
			render: (participant: SeasonSummary) => (
				<TableCell
					content={
						<Button
							icon="EllipsisVertical"
							onClick={() => onMoreClick(participant)}
						/>
					}
				/>
			),
		},
	];
	return (
		<Flex column width="100%">
			<Table
				columns={columns}
				dataset={participants}
				rowsPerPage={10}
				orderBy={Columns.PLACE}
			/>
			<ModalParticipant
				participant={selectedParticipant}
				seasonId={seasonId}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
			/>
		</Flex>
	);
};

export type SeasonSummary = {
	discordId: string;
	member?: Member;
	pointsTotal: number;
	pointsBest: number;
	participationsTotal: number;
	dnfsTotal: number;
	allGolds: number;
	allSilvers: number;
	allBronzes: number;
	allRaces: SeasonLeaderboardEntry[];
};
const useSeasonParticipants = (
	data: SeasonLeaderboardEntry[],
): SeasonSummary[] => {
	const { membersData } = useCuratorMembers();
	const uniqueParticipants = [...new Set(data.map(p => p.discordId))];
	const participants = uniqueParticipants
		.map(discordId => {
			const member = membersData.find(m => m.discordId === discordId);
			const allRaces = data.filter(race => race.discordId === discordId);
			const pointsTotal = allRaces.reduce((sum, cur) => sum + cur.points, 0);
			const pointsBest = allRaces
				.sort((raceA, raceB) => raceA.points - raceB.points)
				.slice(0, allRaces.length - 3)
				.reduce((sum, cur) => sum + cur.points, 0);
			const participationsTotal = allRaces.reduce(
				(sum, cur) => (!cur.dnf && !cur.disqualified ? sum + 1 : sum),
				0,
			);
			const dnfsTotal = allRaces.reduce(
				(sum, cur) => (cur.dnf ? sum + 1 : sum),
				0,
			);
			const allGolds = allRaces.reduce(
				(sum, cur) => (cur.points === 0 ? sum + 1 : sum),
				0,
			);
			const allSilvers = allRaces.reduce(
				(sum, cur) => (cur.points >= 1 && cur.points < 3 ? sum + 1 : sum),
				0,
			);
			const allBronzes = allRaces.reduce(
				(sum, cur) => (cur.points >= 3 && cur.points < 6 ? sum + 1 : sum),
				0,
			);
			return {
				discordId,
				member,
				pointsTotal,
				pointsBest,
				participationsTotal,
				dnfsTotal,
				allGolds,
				allSilvers,
				allBronzes,
				allRaces,
			};
		})
		.filter(player => player.member)
		.sort((playerA, playerB) => playerA.pointsTotal - playerB.pointsTotal)
		.sort((playerA, playerB) => playerB.allBronzes - playerA.allBronzes)
		.sort((playerA, playerB) => playerB.allSilvers - playerA.allSilvers)
		.sort((playerA, playerB) => playerB.allGolds - playerA.allGolds)
		.sort((playerA, playerB) => playerA.pointsBest - playerB.pointsBest);
	return participants;
};

const StyledPlace = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: var(--size-4);
	font-size: var(--font-size-16);
	font-weight: bold;
	font-family: var(--font-dosis);
	padding: var(--size-4);
`;
