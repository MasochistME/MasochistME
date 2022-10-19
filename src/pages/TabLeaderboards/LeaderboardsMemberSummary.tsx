import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Member, Tier } from '@masochistme/sdk/dist/v1/types';
import { useTiers, useCuratorMembers, useMemberLeaderboards } from 'sdk';
import { Flex, Tooltip } from 'components';
import {
	Info,
	Name,
	Icons,
	Avatar,
	Summary,
	Ranking,
	Position,
	PatronIcon,
	RatingScore,
} from './components';

type Props = {
	steamId: string;
	position: number;
	onShowDetails: () => void;
};

export const LeaderboardsMemberSummary = (props: Props): JSX.Element => {
	const history = useHistory();
	const { steamId, position, onShowDetails } = props;
	const [detailsVisible, setDetailsVisible] = useState(false);

	const { membersData } = useCuratorMembers();
	const { tiersData } = useTiers();
	const { leaderData } = useMemberLeaderboards(steamId);

	const {
		name = 'UNKNOWN',
		avatar = 'UNKNOWN',
		isPrivate = true,
		lastUpdated = 0,
	} = membersData.find((m: Member) => m.steamId === steamId) ?? {};

	const member = {
		...leaderData,
		isPrivate,
		name,
		avatar,
		lastUpdated,
	};

	const shekelmaster = member.patreonTier === 4;

	const gameTierPoints = () => {
		return tiersData.map((tier: Tier) => {
			const tierPoints = member.games?.find(game => game.tier === tier.id);
			return (
				<Tooltip
					content={
						<>
							<span>Sum of all games completed in tier {tier.id}</span>
							<span>Points total: {tierPoints?.points}</span>
						</>
					}>
					<RatingScore key={`member-rating-score-${tier.id}`}>
						{tierPoints?.total}
						<i className={tier.icon} style={{ paddingRight: '5px' }} />
					</RatingScore>
				</Tooltip>
			);
		});
	};

	const infoIcon = () => {
		if (member?.isPrivate) {
			return (
				<Tooltip content="This user has their profile set to private.">
					<i
						className="fas fa-exclamation-triangle"
						style={{
							color: '#ff0000',
							marginLeft: '10px',
							cursor: 'help',
							opacity: '0.5',
						}}
					/>
				</Tooltip>
			);
		}
		// if (Date.now() - member?.lastUpdated > 2592000000) {
		// 	return (
		// 		<Tooltip content="This user wasn't updated in over a month - their data might be outdated.">
		// 			<i
		// 				className="fas fa-exclamation-circle"
		// 				style={{
		// 					color: '#fdc000',
		// 					marginLeft: '10px',
		// 					cursor: 'help',
		// 					opacity: '0.5',
		// 				}}
		// 			/>
		// 		</Tooltip>
		// 	);
		// }
		return (
			<i
				className="fas fa-exclamation-circle"
				style={{ color: 'transparent', marginLeft: '10px' }}
			/>
		);
	};

	const onShowDetailsClick = (
		event: React.MouseEvent<HTMLDivElement>,
	): void => {
		setDetailsVisible(!detailsVisible);
		onShowDetails();
		event.stopPropagation();
	};

	const onShowProfile = () => {
		if (steamId) history.push(`/profile/${steamId}`);
	};

	return (
		<Summary
			shekelmaster={shekelmaster}
			disabled={member.isPrivate}
			onClick={onShowProfile}>
			<Position>{position}</Position>
			<Avatar src={member.avatar} alt="avatar" />
			<Icons>
				{member.patreonTier ? (
					// <Tooltip content={patron.description.toUpperCase()}>
					<PatronIcon tier={member.patreonTier} className="fas fa-donate" />
				) : (
					// </Tooltip>
					<PatronIcon
						className="fas fa-donate"
						style={{ color: 'transparent' }}
					/>
				)}
				{infoIcon()}
			</Icons>
			<Info>
				<Flex
					row
					justify
					align
					width="64px"
					height="64px"
					onClick={onShowDetailsClick}>
					<i
						className={`fas fa-chevron-down icon-hover ${
							detailsVisible ? 'icon-active' : ''
						}`}
					/>
				</Flex>
				<Flex row>
					<Name shekelmaster={shekelmaster}>{member.name}</Name>
				</Flex>
				<div className="dummy"></div>
				<Ranking>
					<Tooltip content="Sum of all points">
						<RatingScore>
							{member.sum ?? 0}
							<span className="bold"> Σ</span>
						</RatingScore>
					</Tooltip>
					{gameTierPoints()}
					<Tooltip
						content={
							<>
								<span>Sum of all badges earned</span>
								<span>Points total: {member.badges?.points}</span>
							</>
						}>
						<RatingScore>
							{member.badges?.total}
							<i className="fas fa-medal" style={{ paddingRight: '5px' }} />
						</RatingScore>
					</Tooltip>
				</Ranking>
			</Info>
		</Summary>
	);
};
