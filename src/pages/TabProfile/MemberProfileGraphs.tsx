// import React from 'react';
// import { orderBy } from 'lodash';
// import moment from 'moment';
// import { Tier, Game, Member } from '@masochistme/sdk/dist/v1/types';

// import { useCuratedGames, useTiers, useMemberById } from 'sdk';
// import { Section } from 'containers';
// import { log } from 'utils';
// import { Flex, Spinner } from 'components';

// type Props = {
// 	memberId: string;
// };

// export const MemberProfileGraphs = (props: Props): JSX.Element | null => {
// 	const { memberId } = props;

// 	const { tiersData: tiers } = useTiers();
// 	const { gamesData: games } = useCuratedGames();
// 	const { memberData: member, isLoading, isFetched } = useMemberById(memberId);

// 	if (isLoading) return <Spinner />;
// 	if (isFetched && member)
// 		return (
// 			<Flex justify flexWrap="wrap" width="100%" gap={16}>
// 				<Section
// 					minWidth="300px"
// 					maxWidth="300px"
// 					title="Hour played (total)"
// 					content={
// 						<DoughnutChart
// 							labels={summarizeTotalTimes(
// 								'label',
// 								'total',
// 								tiers,
// 								member,
// 								games,
// 							)}
// 							dataset={summarizeTotalTimes(
// 								'sum',
// 								'total',
// 								tiers,
// 								member,
// 								games,
// 							)}
// 						/>
// 					}
// 				/>
// 				<Section
// 					title="Hours played (completed)"
// 					minWidth="300px"
// 					maxWidth="300px"
// 					content={
// 						<DoughnutChart
// 							labels={summarizeTotalTimes(
// 								'label',
// 								'completed',
// 								tiers,
// 								member,
// 								games,
// 							)}
// 							dataset={summarizeTotalTimes(
// 								'sum',
// 								'completed',
// 								tiers,
// 								member,
// 								games,
// 							)}
// 						/>
// 					}
// 				/>
// 				<Section
// 					minWidth="300px"
// 					maxWidth="300px"
// 					title="Games completed"
// 					content={
// 						<DoughnutChart
// 							labels={summarizeTotalGames('label', tiers, member, games)}
// 							dataset={summarizeTotalGames('sum', tiers, member, games)}
// 						/>
// 					}
// 				/>
// 				<Section
// 					fullWidth
// 					title="Completion timeline"
// 					content={
// 						<LineChart
// 							labels={getTimelines('label', tiers, member, games)}
// 							datasets={[
// 								{
// 									label: 'games',
// 									data: getTimelines('games', tiers, member, games),
// 								},
// 								{
// 									label: 'points',
// 									data: getTimelines('points', tiers, member, games),
// 								},
// 							]}
// 						/>
// 					}
// 				/>
// 			</Flex>
// 		);
// 	return null;
// };

// /**
//  *
//  */
// const summarizeTotalTimes = (
// 	type: string,
// 	scope: string,
// 	tiers: Tier[],
// 	_member: Member,
// 	games: Game[],
// ) => {
// 	const data: Rating[] = [];

// 	// let memberGames = member?.games;
// 	let memberGames: any[] = []; // TODO Replace with real member games data

// 	tiers.map((tier: Tier) =>
// 		data.push({
// 			sum: 0,
// 			label: tier.symbol,
// 			id: tier.id,
// 		}),
// 	);

// 	if (scope === 'completed') {
// 		memberGames = memberGames.filter((game: any) => game.percentage === 100);
// 	}

// 	memberGames
// 		.filter((game: any) => games.find((g: Game) => g.id === game.id))
// 		.map((game: any) => {
// 			game = {
// 				...game,
// 				tier: games.find((g: Game) => g.id === game.id)?.tier,
// 			};
// 			const index = data.findIndex((d: any) => d.id === game.tier);
// 			if (data[index]?.sum) data[index].sum += game.playtime;
// 			return game;
// 		});

// 	return data.map((d: any) =>
// 		typeof d[type] === 'number' ? Math.floor(d[type]) : d[type],
// 	);
// };

// /**
//  *
//  */
// const getTimelines = (
// 	type: string,
// 	tiers: Tier[],
// 	_member: Member,
// 	games: Game[],
// ) => {
// 	let data = [];
// 	let gamesTotal = 0;
// 	let pointsTotal = 0;
// 	let startDate = 0;
// 	let endDate = 0;

// 	// let timelines = member?.games.filter((game: any) => game.percentage === 100);
// 	let timelines: any[] = []; // TODO Replace with real timelines data
// 	timelines = orderBy(timelines, ['lastUnlocked'], ['asc']);

// 	// @ts-ignore
// 	startDate = moment(new Date(timelines[0]?.lastUnlocked * 1000));
// 	// @ts-ignore
// 	endDate = moment(
// 		new Date(timelines[timelines.length - 1]?.lastUnlocked * 1000),
// 	);

// 	// @ts-ignore
// 	while (startDate.isBefore(endDate)) {
// 		data.push({
// 			// @ts-ignore: any
// 			label: startDate.format('YYYY-MM'),
// 			games: 0,
// 			points: 0,
// 		});
// 		// @ts-ignore: any
// 		startDate.add(1, 'month');
// 	}

// 	data = data.map((date: any) => {
// 		const gamesCompletedInMonth = timelines
// 			.filter((game: any) => {
// 				const month = new Date(game.lastUnlocked * 1000).getMonth() + 1;
// 				const year = new Date(game.lastUnlocked * 1000).getFullYear();
// 				return (
// 					date.label === `${year}-${month < 10 ? `0${month}` : month}` &&
// 					games.find((g: Game) => g.id === game.id)
// 				);
// 			})
// 			.map((game: any) => {
// 				try {
// 					date.points +=
// 						tiers.find(
// 							(tier: Tier) =>
// 								tier.id === games.find((g: Game) => g.id === game.id)?.tier,
// 						)?.score ?? 0;
// 				} catch (err: any) {
// 					log.WARN(err);
// 					date.points = 0;
// 				}
// 				return game;
// 			});
// 		if (gamesCompletedInMonth.length !== 0) {
// 			gamesTotal = gamesTotal + gamesCompletedInMonth.length;
// 			pointsTotal = pointsTotal + date.points;
// 		}
// 		date.games = gamesTotal;
// 		date.points = pointsTotal;
// 		return date;
// 	});

// 	return data.map((d: any) => d[type]);
// };

// /**
//  *
//  */
// const summarizeTotalGames = (
// 	type: string,
// 	tiers: Tier[],
// 	_member: Member,
// 	games: Game[],
// ) => {
// 	const data: any = [];
// 	const memberGames: any[] = []; // TODO Replace with real member games data
// 	// const memberGames = member?.games ?? [];

// 	tiers.map((tier: Tier) =>
// 		data.push({
// 			sum: 0,
// 			label: tier.symbol,
// 			id: tier.id,
// 		}),
// 	);

// 	memberGames
// 		.filter(
// 			(game: any) =>
// 				game.percentage === 100 &&
// 				games.find((g: any) => parseInt(g.id) === game.id),
// 		)
// 		.map((game: any) => {
// 			game = {
// 				...game,
// 				tier: games.find((g: Game) => g.id === game.id)?.tier ?? 0,
// 			};
// 			const index = data.findIndex((d: any) => d.id === game.tier);
// 			if (data[index]?.sum) data[index].sum += 1;
// 			return game;
// 		});
// 	return data.map((d: any) => d[type]);
// };

// type Rating = {
// 	sum: number;
// 	label: string;
// 	id: string;
// };

export {};
