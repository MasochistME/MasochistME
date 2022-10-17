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
} from './styles';
import { Member } from '@masochistme/sdk/dist/v1/types';

UserSummary.Name = Name;
UserSummary.Info = Info;
UserSummary.Icons = Icons;
UserSummary.Avatar = Avatar;
UserSummary.Summary = Summary;
UserSummary.Ranking = Ranking;
UserSummary.Position = Position;
UserSummary.PatronIcon = PatronIcon;
UserSummary.RatingScore = RatingScore;

type TUserSummary = {
	id: any;
	position: number;
	onShowDetails: () => any;
};

function UserSummary(props: TUserSummary): JSX.Element {
	const history = useHistory();
	const { id, position, onShowDetails } = props;
	const [detailsVisible, setDetailsVisible] = useState(false);
	const [userId, setUserId] = useState(0);

	const { membersData } = useMembers();
	const { tiersData } = useTiers();

	const member = useSelector((state: any) => {
		const userRank = state.ranking.find((u: any) => u.id === id);
		const memberData = membersData.find((m: Member) => m.steamId === id);
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
				<UserSummary.RatingScore
					key={`member-rating-score-${scoreIndex}`}
					title={`Sum of all games completed in tier ${scoreId}.\nPoints total: ${tierPoints?.points}`}>
					{tierPoints?.total}
					<i className={score.icon} style={{ paddingRight: '5px' }} />
				</UserSummary.RatingScore>
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
		<UserSummary.Summary
			shekelmaster={shekelmaster}
			disabled={disabled}
			onClick={onShowProfile}>
			<UserSummary.Position>{position + 1}</UserSummary.Position>
			<UserSummary.Avatar src={member.avatar} alt="avatar" />
			<UserSummary.Icons>
				{patreonTier ? (
					<UserSummary.PatronIcon
						tier={patreonTier}
						className="fas fa-donate"
						// title={patron.description.toUpperCase()}
					/>
				) : (
					<UserSummary.PatronIcon
						className="fas fa-donate"
						style={{ color: 'transparent' }}
					/>
				)}
				{infoIcon()}
			</UserSummary.Icons>
			<UserSummary.Info>
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
					<UserSummary.Name tier={patreonTier} shekelmaster={shekelmaster}>
						{member.name}
					</UserSummary.Name>
				</Flex>
				<div className="dummy"></div>
				<UserSummary.Ranking>
					<UserSummary.RatingScore title="Sum of all points">
						{member.points.sum ? member.points.sum : 0}
						<span className="bold"> Σ</span>
					</UserSummary.RatingScore>
					{gameTierPoints()}
					<UserSummary.RatingScore
						title={`Sum of all badges earned.\nPoints total: ${badges.points}`}>
						{badges.total}
						<i className="fas fa-medal" style={{ paddingRight: '5px' }} />
					</UserSummary.RatingScore>
				</UserSummary.Ranking>
			</UserSummary.Info>
		</UserSummary.Summary>
	);
}

export default React.memo(UserSummary);
