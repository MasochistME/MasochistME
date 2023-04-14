import styled from 'styled-components';
import { Award } from '@masochistme/sdk/dist/v1/types';
import { ColorTokens, useTheme } from 'styles';
import { Button, ErrorFallback, Flex, Icon, Size } from 'components';
import { AwardThumbnail } from 'containers/AwardThumbnail';
import { useMemberAward } from 'hooks';

type Props = {
	award: Award;
	memberId: string;
};

export const ModalAwardHeader = (props: Props) => {
	const { award: originalAward, memberId } = props;
	const { colorTokens } = useTheme();

	const awardId = String(originalAward._id);
	const { award, isUnlocked, timesUnlocked } = useMemberAward(
		awardId,
		memberId,
	);

	if (!award) return <ErrorFallback />;
	return (
		<StyledAwardHeader colorTokens={colorTokens}>
			<h2>{award.name}</h2>
			<Flex gap={16}>
				<AwardSwapper award={award} isUnlocked={isUnlocked} />
				<Flex
					column
					style={{
						width: '100%',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
					}}>
					<div style={{ fontStyle: 'italic' }}>{award.description}</div>
					<StyledAwardOwned>Owned: {timesUnlocked}</StyledAwardOwned>
				</Flex>
			</Flex>
		</StyledAwardHeader>
	);
};

const AwardSwapper = ({
	award,
	isUnlocked,
}: {
	award: Award;
	isUnlocked: boolean;
}) => {
	const onPrevAwardClick = () => {
		alert('At some point I will code this button, but now is not that time.');
	};
	const onNextAwardClick = () => {
		alert('At some point I will code this button, but now is not that time.');
	};
	return (
		<StyledAwardSwapper>
			<Flex align justify>
				<Button icon="CaretLeft" size={Size.LARGE} onClick={onPrevAwardClick} />
				<AwardThumbnail award={award} isUnlocked={isUnlocked} />
				<Button
					icon="CaretRight"
					size={Size.LARGE}
					onClick={onNextAwardClick}
				/>
			</Flex>
			<div className="tier__number">Tier: 3</div>
			<div className="tier__name">GOLDEN</div>
		</StyledAwardSwapper>
	);
};

const StyledAwardHeader = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: var(--size-16);
	border-bottom: 3px solid
		${({ colorTokens }) => colorTokens['element-color--button-border']};
	h2 {
		margin: 0;
		font-size: var(--font-size-32);
		font-family: var(--font-dosis);
		margin-bottom: var(--size-8);
	}
`;

const StyledAwardOwned = styled.div`
	align-self: flex-end;
	font-weight: 600;
	font-size: var(--font-size-24);
	font-family: var(--font-dosis);
`;

const StyledAwardSwapper = styled.div`
	display: flex;
	flex-direction: column;
	font-family: var(--font-dosis);
	gap: var(--size-4);
	.tier__number {
		font-size: var(--font-size-24);
		line-height: var(--font-size-24);
	}
	.tier__name {
		text-transform: uppercase;
		font-size: var(--font-size-32);
		line-height: var(--font-size-32);
	}
`;
