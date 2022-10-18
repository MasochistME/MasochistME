import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Member, Tier } from '@masochistme/sdk/dist/v1/types';
import { useTiers, useCuratorMembers, useMemberLeaderboards } from 'sdk';
import { Flex } from 'components';
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
				<RatingScore
					key={`member-rating-score-${tier.id}`}
					title={`Sum of all games completed in tier ${tier.id}.\nPoints total: ${tierPoints?.points}`}>
					{tierPoints?.total}
					<i className={tier.icon} style={{ paddingRight: '5px' }} />
				</RatingScore>
			);
		});
	};

	const infoIcon = () => {
		if (member?.isPrivate) {
			return (
				<i
					className="fas fa-exclamation-triangle"
					title="This user has their profile set to private."
					style={{
						color: '#ff0000',
						marginLeft: '10px',
						cursor: 'help',
						opacity: '0.5',
					}}
				/>
			);
		}
		// if (Date.now() - member?.lastUpdated > 2592000000) {
		// 	return (
		// 		<i
		// 			className="fas fa-exclamation-circle"
		// 			title="This user wasn't updated in over a month - their data might be outdated."
		// 			style={{
		// 				color: '#fdc000',
		// 				marginLeft: '10px',
		// 				cursor: 'help',
		// 				opacity: '0.5',
		// 			}}
		// 		/>
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
					<PatronIcon
						tier={member.patreonTier}
						className="fas fa-donate"
						// title={patron.description.toUpperCase()}
					/>
				) : (
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
					style={{ width: '64px', height: '64px' }}
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
					<RatingScore title="Sum of all points">
						{member.sum ?? 0}
						<span className="bold"> Σ</span>
					</RatingScore>
					{gameTierPoints()}
					<RatingScore
						title={`Sum of all badges earned.\nPoints total: ${member.badges?.points}`}>
						{member.badges?.total}
						<i className="fas fa-medal" style={{ paddingRight: '5px' }} />
					</RatingScore>
				</Ranking>
			</Info>
		</Summary>
	);
};
