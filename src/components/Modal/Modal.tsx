import React from 'react';
import { Box, Modal as MuiModal } from '@mui/material';
import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';

type Props = {
	children: React.ReactNode;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
};

export const Modal = (props: Props) => {
	const { children, isModalOpen, setIsModalOpen } = props;
	const { colorTokens } = useTheme();

	const modalStyle = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxWidth: '90%',
		maxHeight: '90%',
		overflowY: 'auto',
		border: `var(--size-1) solid ${colorTokens['core-extra-bg']}`,
		boxShadow: `0 0 var(--size-10) ${colorTokens['common-color--black']}aa`,
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	return (
		<MuiModal open={isModalOpen} onClose={handleModalClose}>
			<Box sx={modalStyle}>
				<StyledContent colorTokens={colorTokens}>{children}</StyledContent>
			</Box>
		</MuiModal>
	);
};

const StyledContent = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	width: 70rem;
	max-width: 100%;
	height: auto;
	gap: var(--size-16);
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}ee;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: var(--font-raleway);
`;
