import React from 'react';
import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';
import { ErrorFallback, Flex, Loader, Modal, QueryBoundary } from 'components';
import { useMemberAward } from 'hooks';
import { AwardThumbnail } from 'containers/AwardThumbnail';
import { Award } from '@masochistme/sdk/dist/v1/types';

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

	const { awardData: award, memberAwardsData } = useMemberAward(
		awardId,
		memberId,
	);
	const awardChildren = (award?.children ?? [award]) as Award[];

	if (!award) return <ErrorFallback />;
	return (
		<Flex column gap={16} padding="var(--size-16)">
			{awardChildren.map(child => {
				const isUnlocked = !!memberAwardsData.find(
					memberAward => memberAward.awardId === String(child._id),
				);
				return (
					<Flex gap={16}>
						<AwardThumbnail
							awardId={String(child._id)}
							isUnlocked={isUnlocked}
							hasTooltip={false}
						/>
						<StyledAwardDetails>
							<h3>{child?.name}</h3>
							<div>{child?.description}</div>
						</StyledAwardDetails>
					</Flex>
				);
			})}
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

const StyledAwardDetails = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;
