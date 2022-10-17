import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { getTierIcon, getGameThumbnail } from 'utils';
import { useTiers, useGames } from 'shared/hooks';
import { colors } from 'shared/theme';
import { ModalLeaderboards } from 'containers';
import { Img, Desc, Info, Title, Rating } from './styles';
import { Spinner } from 'components';

Modal.setAppElement('#root');

type Props = {
	gameId: number;
};

export const GameTile = (props: Props): JSX.Element => {
	const { gameId } = props;
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const { tiersData } = useTiers();
	const { gamesData } = useGames();

	const game = gamesData.find((g: Game) => g.id === gameId);

	const onExtend = (event: any) => {
		event.cancelBubble = true;
		setModalIsOpen(!modalIsOpen);
	};

	return (
		<StyledGameTile onClick={onExtend}>
			{!game && <Spinner />}
			{game && (
				<>
					<Img
						className={`game-tier-${game.tier}`}
						extended={modalIsOpen}
						src={getGameThumbnail(game.id)}>
						<Info>
							<Rating>
								<i
									className={
										game ? getTierIcon(game.tier, tiersData) : 'fas fa-spinner'
									}></i>
							</Rating>
							<Title>{game.title}</Title>
							<Desc>{game.description}</Desc>
						</Info>
					</Img>
					{/* @ts-ignore */}
					<Modal isOpen={modalIsOpen} style={{ ...modalStyle }}>
						<ModalLeaderboards gameId={game.id} compact />
					</Modal>
				</>
			)}
		</StyledGameTile>
	);
};

const StyledGameTile = styled.div.attrs(
	({ extended }: { extended?: boolean }) => {
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
	},
)<{ extended?: boolean }>``;

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
