import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { colors, fonts, media } from 'shared/theme';
import { Flex, ProgressBar } from 'components';
import { UserBadges } from 'containers';

type TUserProps = {
	game: any;
	member: any;
};

export const UserGame = (props: TUserProps): JSX.Element => {
	const { game, member } = props;
	const history = useHistory();
	const percentage = isNaN(Math.floor(game.percentage))
		? 0
		: Math.floor(game.percentage);

	const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

	return (
		<StyledUserGame>
			<StyledUserGameStats>
				{game.percentage === 100 ? (
					<StyledUserGameCompletionTime>
						{new Date(game.lastUnlocked * 1000).toLocaleString()}
					</StyledUserGameCompletionTime>
				) : null}
				<div style={{ display: 'none' }}>
					{game.playtime
						? typeof game.playtime === 'number'
							? Math.round(game.playtime)
							: Math.round(Number(game.playtime))
						: 0}{' '}
					h
				</div>
			</StyledUserGameStats>
			<StyledUserGameThumbnail src={game.img} alt="Game thumbnail" />
			<StyledUserGameInfo>
				<Flex row>
					<i className={game.rating} />
					<StyledUserGameTitle onClick={onGameClick}>
						{game.title}
					</StyledUserGameTitle>
				</Flex>
			</StyledUserGameInfo>
			<UserBadges game={game} user={member} />
			<ProgressBar percentage={percentage} />
		</StyledUserGame>
	);
};

const StyledUserGame = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 37px;
	align-items: center;
	background-color: ${colors.darkBlueTransparent};
	border-bottom: 1px solid ${colors.newDark};
	border-top: 1px solid ${colors.newMediumGrey};
	&:first-child {
		border-top: none;
	}
	&:last-child {
		border-bottom: none;
	}
`;

const StyledUserGameThumbnail = styled.img`
	margin: 0;
	padding: 0;
	min-height: 37px;
	max-height: 37px;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledUserGameInfo = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
	margin: 0 10px;
`;

const StyledUserGameStats = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 0.7em;
	font-family: ${fonts.Verdana};
	color: ${colors.superLightGrey};
	width: 80px;
	min-width: 80px;
	margin: 0 0 0 6px;
`;

const StyledUserGameCompletionTime = styled.div`
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledUserGameTitle = styled.div`
	margin-left: 5px;
	&:hover {
		color: ${colors.white};
	}
`;
