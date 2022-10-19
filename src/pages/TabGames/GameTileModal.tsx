import React from 'react';
import Modal from 'react-modal';

import { colors } from 'shared/theme';
import { ModalLeaderboards } from 'containers';

Modal.setAppElement('#root');

type Props = {
	gameId: number;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

export const GameTileModal = (props: Props): JSX.Element => {
	const { gameId, isOpen, setIsOpen: _ } = props;

	return (
		<Modal isOpen={isOpen} style={{ ...modalStyle }}>
			<ModalLeaderboards gameId={gameId} compact />
		</Modal>
	);
};

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
		// boxSizing: 'border-box',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
};
