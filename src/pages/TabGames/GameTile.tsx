import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import styled from 'styled-components';

import { getTierIcon } from 'shared/helpers';
import { colors } from 'shared/theme';
import { ModalLeaderboards } from 'containers';
import { Img, Desc, Info, Title, Rating } from './styles';

Modal.setAppElement('#root');

type Props = {
	id: any;
	rating: any;
};

export const GameTile = (props: Props): JSX.Element => {
	const { id, rating } = props;
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const game = useSelector((state: any) =>
		state.games.list.find((g: any) => g.id === id),
	);

	const onExtend = (event: any) => {
		event.cancelBubble = true;
		setModalIsOpen(!modalIsOpen);
	};

	return (
		<StyledGame onClick={onExtend}>
			<GameTile.Img
				className={`rated-${game.rating}`}
				extended={modalIsOpen}
				src={game?.img}>
				<GameTile.Info>
					<GameTile.Rating>
						<i
							className={
								game ? getTierIcon(game.rating, rating) : 'fas fa-spinner'
							}></i>
					</GameTile.Rating>
					<GameTile.Title>{game.title}</GameTile.Title>
					<GameTile.Desc>{game.desc}</GameTile.Desc>
				</GameTile.Info>
			</GameTile.Img>
			{
				// @ts-ignore
				<Modal isOpen={modalIsOpen} style={{ ...modalStyle }}>
					<ModalLeaderboards id={game.id} rating={game.rating} compact />
				</Modal>
			}
		</StyledGame>
	);
};

const StyledGame = styled.div.attrs(({ extended }: { extended?: boolean }) => {
	const style = extended
		? {
				position: 'fixed',
				top: 0,
				left: 0,
				zIndex: 1000,
				width: '100vw',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: `${colors.newDark}dd`,
		  }
		: {};
	return { style };
})<{ extended?: boolean }>``;

const modalStyle = {
	overlay: {
		zIndex: '9999',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: `${colors.newDark}cc`,
		width: '100vw',
		height: '100vh',
	},
	content: {
		backgroundColor: '#00000000',
		border: 'none',
		inset: 0,
		padding: 0,
		borderRadius: 0,
		width: '100%',
		height: '100%',
		boxSizing: 'border-box',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
};

GameTile.Img = Img;
GameTile.Desc = Desc;
GameTile.Info = Info;
GameTile.Title = Title;
GameTile.Rating = Rating;
