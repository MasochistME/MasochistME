import React from 'react';
import { Link } from 'react-router-dom';
import { Race, RaceWithSummary } from '@masochistme/sdk/dist/v1/types';

import { DateBlock, Flex, Table, TableCell, TableColumn } from 'components';
import { getHumanReadableDate } from 'utils';
import { useMemberData } from 'hooks';

type Props = {
	races: Race[];
};

enum Columns {
	DATE = 'Start date',
	RACE_NAME = 'Race name',
	SIGN_UPS = 'Signups',
	PARTICIPANTS = 'Participants',
	DNF = 'DNF',
	TYPE = 'Type',
	WINNER = 'Winner',
}

export const SingleSeasonRaces = (props: Props): JSX.Element => {
	const { races } = props;

	const columns: TableColumn<RaceWithSummary>[] = [
		{
			key: Columns.DATE,
			title: Columns.DATE,
			value: (race: RaceWithSummary) => getHumanReadableDate(race.startDate),
			render: (race: RaceWithSummary) => (
				<DateBlock date={race.startDate} width="100px" />
			),
		},
		{
			key: Columns.RACE_NAME,
			title: Columns.RACE_NAME,
			value: (race: RaceWithSummary) => race.name,
			render: (race: RaceWithSummary) => (
				<TableCell content={race.name} isNoWrap isCentered={false} />
			),
		},
		{
			key: Columns.SIGN_UPS,
			title: Columns.SIGN_UPS,
			value: (race: RaceWithSummary) => String(race.summary?.signups ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.signups} />
			),
		},
		{
			key: Columns.PARTICIPANTS,
			title: Columns.PARTICIPANTS,
			value: (race: RaceWithSummary) => String(race.summary?.participants ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.participants} />
			),
		},
		{
			key: Columns.DNF,
			title: Columns.DNF,
			value: (race: RaceWithSummary) => String(race.summary?.dnf ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.dnf} />
			),
		},
		{
			key: Columns.TYPE,
			title: Columns.TYPE,
			value: (race: RaceWithSummary) => race.type,
			render: (race: RaceWithSummary) => <TableCell content={race.type} />,
		},
		{
			key: Columns.WINNER,
			title: Columns.WINNER,
			value: (race: RaceWithSummary) => String(race.summary?.winner ?? null),
			render: (race: RaceWithSummary) => (
				<WinnerLink discordId={race.summary?.winner} />
			),
		},
	];

	return (
		<Flex column width="100%">
			<Table columns={columns} dataset={races} />
		</Flex>
	);
};

const WinnerLink = ({ discordId }: { discordId?: string | null }) => {
	const { getMemberUsername, getMemberSteamId } = useMemberData(discordId);
	const steamId = getMemberSteamId();
	const username = getMemberUsername();
	return (
		<Link to={`/profile/${steamId}`}>
			<h4>{username}</h4>
		</Link>
	);
};
