import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useTiers, useMembers } from 'shared/hooks';
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
import { Member } from '@masochistme/sdk/dist/v1/types';

type Props = {
	steamId: any;
	position: number;
	onShowDetails: () => any;
};

export const UserSummary = (props: Props): JSX.Element => {
	const history = useHistory();
	const { steamId, position, onShowDetails } = props;
	const [detailsVisible, setDetailsVisible] = useState(false);
	const [userId, setUserId] = useState(0);

	const { membersData } = useMembers();
	const { tiersData } = useTiers();

	const member = useSelector((state: any) => {
		const userRank = state.ranking.find((u: any) => u.id === steamId);
		const memberData = membersData.find((m: Member) => m.steamId === steamId);
		return {
			...userRank,
			private: memberData?.isPrivate,
			name: memberData?.name,
			avatar: memberData?.avatar,
			updated: memberData?.lastUpdated,
		};
	});
	const badges = member.points.badges;
	const patreonTier = member.patreon.tier;
	const shekelmaster = Number(patreonTier) === 4;
	const disabled = member.points.sum - member.points.badges <= 0 ? true : false;

	const gameTierPoints = () => {
		return tiersData.map((score: any, scoreIndex: number) => {
			const scoreId =
				typeof score.id !== 'number' ? Number(score.id) : score.id;
			const tierPoints = member.points.list.find(
				(gameTier: any) => gameTier.tier === scoreId,
			);
			return (
				<RatingScore
					key={`member-rating-score-${scoreIndex}`}
					title={`Sum of all games completed in tier ${scoreId}.\nPoints total: ${tierPoints?.points}`}>
					{tierPoints?.total}
					<i className={score.icon} style={{ paddingRight: '5px' }} />
				</RatingScore>
			);
		});
	};

	const infoIcon = () => {
		if (member?.private) {
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
		if (Date.now() - member?.updated > 2592000000) {
			return (
				<i
					className="fas fa-exclamation-circle"
					title="This user wasn't updated in over a month - their data might be outdated."
					style={{
						color: '#fdc000',
						marginLeft: '10px',
						cursor: 'help',
						opacity: '0.5',
					}}
				/>
			);
		}
		return (
			<i
				className="fas fa-exclamation-circle"
				style={{ color: 'transparent', marginLeft: '10px' }}
			/>
		);
	};

	const onShowDetailsClick = (event: any): void => {
		setDetailsVisible(!detailsVisible);
		onShowDetails();
		event.stopPropagation();
	};
	const onShowProfile = () => {
		history.push(`/profile/${userId}`);
	};

	useEffect(() => {
		setUserId(member.id);
	}, []);

	return (
		<Summary
			shekelmaster={shekelmaster}
			disabled={disabled}
			onClick={onShowProfile}>
			<Position>{position + 1}</Position>
			<Avatar src={member.avatar} alt="avatar" />
			<Icons>
				{patreonTier ? (
					<PatronIcon
						tier={patreonTier}
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
					{disabled ? (
						<i
							className="fas fa-exclamation-triangle"
							title="This user has their Steam profile set to private."
						/>
					) : (
						<div></div>
					)}
					<Name tier={patreonTier} shekelmaster={shekelmaster}>
						{member.name}
					</Name>
				</Flex>
				<div className="dummy"></div>
				<Ranking>
					<RatingScore title="Sum of all points">
						{member.points.sum ? member.points.sum : 0}
						<span className="bold"> Σ</span>
					</RatingScore>
					{gameTierPoints()}
					<RatingScore
						title={`Sum of all badges earned.\nPoints total: ${badges.points}`}>
						{badges.total}
						<i className="fas fa-medal" style={{ paddingRight: '5px' }} />
					</RatingScore>
				</Ranking>
			</Info>
		</Summary>
	);
};
