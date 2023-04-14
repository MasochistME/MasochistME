import React from 'react';
import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';
import { ErrorFallback, Flex, Loader, Modal, QueryBoundary } from 'components';
import { Award } from '@masochistme/sdk/dist/v1/types';
import { ModalAwardHeader } from './ModalAwardHeader';
import { ModalAwardChild } from './ModalAwardChild';
import { useAward } from 'sdk';

type Props = {
	awardId: string;
	memberId: string;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
};

export const ModalAward = (props: Props) => {
	const { isModalOpen, setIsModalOpen, ...rest } = props;
	const { colorTokens } = useTheme();

	return (
		<Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
			<Wrapper column colorTokens={colorTokens}>
				<QueryBoundary fallback={<Loader />}>
					<ModalAwardBoundary {...rest} />
				</QueryBoundary>
			</Wrapper>
		</Modal>
	);
};

const ModalAwardBoundary = (props: Pick<Props, 'awardId' | 'memberId'>) => {
	const { awardId, memberId } = props;
	const { awardData: award } = useAward(awardId);

	const awardChildren = (award?.children ?? [award]) as Award[];

	if (!award) return <ErrorFallback />;
	return (
		<Flex column>
			<ModalAwardHeader award={award} memberId={memberId} />
			<Flex column>
				{awardChildren.map(child => (
					<ModalAwardChild award={child} memberId={memberId} />
				))}
			</Flex>
		</Flex>
	);
};

const Wrapper = styled(Flex)<{ colorTokens: ColorTokens }>`
	box-sizing: border-box;
	text-align: center;
	width: 70rem;
	max-width: 100%;
	height: auto;
	gap: var(--size-16);
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}ee;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: var(--font-raleway);
`;
