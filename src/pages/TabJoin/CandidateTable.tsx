import { Candidate, CandidateGame } from '@masochistme/sdk/dist/v1/types';
import styled from 'styled-components';

import { Icon, Size, Table, TableCell, TableColumn } from 'components';
import { GameThumbnail } from 'containers';
import { useTiers } from 'sdk';
import { useTheme } from 'styles';
import { getTierIcon } from 'utils';

enum Columns {
	TIER = '',
	TITLE = 'Game title',
	COMPLETED = 'Completed?',
}

type Props = { candidate: Candidate };

export const CandidateTable = ({ candidate }: Props) => {
	const { colorTokens } = useTheme();
	const { tiersData } = useTiers();
	const columns: TableColumn<CandidateGame>[] = [
		{
			key: Columns.TIER,
			title: Columns.TIER,
			value: (game: CandidateGame) => game.tier,
			render: (game: CandidateGame) => (
				<Icon icon={getTierIcon(game.tier, tiersData)} size={Size.MICRO} />
			),
			style: { minWidth: `${Size.SMALL}rem`, maxWidth: `${Size.SMALL}rem` },
		},
		{
			key: Columns.TITLE,
			title: Columns.TITLE,
			value: (game: CandidateGame) => game.title,
			render: (game: CandidateGame) => (
				<TableCell
					content={
						<StyledCandidateGameTitle>
							<GameThumbnail gameId={game.id} size={Size.SMALL} />
							{game.title}
						</StyledCandidateGameTitle>
					}
					isCentered={false}
				/>
			),
			style: { width: '80%' },
		},
		{
			key: Columns.COMPLETED,
			title: Columns.COMPLETED,
			value: (game: CandidateGame) => String(game.pts > 0),
			render: (game: CandidateGame) => {
				if (game.pts > 0)
					return (
						<Icon
							icon="SquareCheck"
							color={colorTokens['semantic-color--success']}
						/>
					);
				return (
					<Icon icon="SquareX" color={colorTokens['semantic-color--error']} />
				);
			},
			style: { width: '1rem' },
		},
	];

	return (
		<Table
			columns={columns}
			dataset={candidate.games}
			rowsPerPage={20}
			orderBy={Columns.COMPLETED}
			order="desc"
		/>
	);
};

const StyledCandidateGameTitle = styled.div`
	display: flex;
	align-items: center;
	gap: var(--size-8);
	text-align: left;
	font-family: var(--font-dosis);
	font-size: var(--font-size-16);
`;
