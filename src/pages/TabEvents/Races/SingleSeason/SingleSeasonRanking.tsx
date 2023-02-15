import { useState } from 'react';
import { Member, SeasonLeaderboardEntry } from '@masochistme/sdk/dist/v1/types';
import {
	Button,
	ErrorFallback,
	Flex,
	Loader,
	QueryBoundary,
	Table,
	TableCell,
	TableColumn,
} from 'components';
import { WinnerLink } from 'containers';
import { useCuratorMembers, useSeasonLeaderboards } from 'sdk';
import { ModalParticipant } from './ModalParticipant';

type Props = { seasonId: string };
export const SingleSeasonRanking = (props: Props) => (
	<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
		<RankingBoundary {...props} />
	</QueryBoundary>
);

enum Columns {
	PARTICIPANT = 'Participant',
	SCORE_BEST = 'Score (best of)',
	SCORE_ALL = 'Score (all)',
	GOLD = 'Gold medals',
	SILVER = 'Silver medals',
	BRONZE = 'Bronze medals',
	PARTICIPATIONS = 'Participations',
	DNF = 'DNF',
	MORE = '',
}

const RankingBoundary = ({ seasonId }: Props) => {
	const { data = [] } = useSeasonLeaderboards({ seasonId });
	const participants = useSeasonParticipants(data);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedParticipant, setSelectedParticipant] =
		useState<SeasonSummary | null>(null);

	const onMoreClick = (participant: SeasonSummary) => {
		if (participant) {
			setIsModalOpen(!isModalOpen);
			setSelectedParticipant(participant);
		}
	};

	const columns: TableColumn<SeasonSummary>[] = [
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
			key: Columns.SCORE_ALL,
			title: Columns.SCORE_ALL,
			value: (participant: SeasonSummary) => participant.pointsTotal,
			render: (participant: SeasonSummary) => participant.pointsTotal,
			style: { width: '90px' },
		},
		{
			key: Columns.SCORE_BEST,
			title: Columns.SCORE_BEST,
			value: (participant: SeasonSummary) => participant.pointsBest,
			render: (participant: SeasonSummary) => participant.pointsBest,
			style: { width: '90px' },
		},
		{
			key: Columns.GOLD,
			title: Columns.GOLD,
			value: (participant: SeasonSummary) => participant.allGolds,
			render: (participant: SeasonSummary) => participant.allGolds,
			style: { width: '90px' },
		},
		{
			key: Columns.SILVER,
			title: Columns.SILVER,
			value: (participant: SeasonSummary) => participant.allSilvers,
			render: (participant: SeasonSummary) => participant.allSilvers,
			style: { width: '90px' },
		},
		{
			key: Columns.BRONZE,
			title: Columns.BRONZE,
			value: (participant: SeasonSummary) => participant.allBronzes,
			render: (participant: SeasonSummary) => participant.allBronzes,
			style: { width: '90px' },
		},
		{
			key: Columns.PARTICIPATIONS,
			title: Columns.PARTICIPATIONS,
			value: (participant: SeasonSummary) => participant.participationsTotal,
			render: (participant: SeasonSummary) => participant.participationsTotal,
			style: { width: '90px' },
		},
		{
			key: Columns.DNF,
			title: Columns.DNF,
			value: (participant: SeasonSummary) => participant.dnfsTotal,
			render: (participant: SeasonSummary) => participant.dnfsTotal,
			style: { width: '90px' },
		},
		{
			key: Columns.MORE,
			title: Columns.MORE,
			value: () => 0,
			render: (participant: SeasonSummary) => (
				<Button
					icon="EllipsisVertical"
					onClick={() => onMoreClick(participant)}
				/>
			),
		},
	];
	return (
		<Flex column width="100%">
			<Table columns={columns} dataset={participants} rowsPerPage={10} />
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
				.sort((raceA, raceB) => raceB.points - raceA.points)
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
		.sort((playerA, playerB) => playerA.pointsTotal - playerB.pointsTotal);
	return participants;
};
