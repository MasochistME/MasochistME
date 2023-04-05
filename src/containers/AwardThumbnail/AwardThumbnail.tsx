import { Award } from '@masochistme/sdk/dist/v1/types';
import { QueryBoundary, Size, Skeleton, Tooltip } from 'components';
import { CommonProps } from 'containers/CommonProps';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';
import { getAwardThumbnail } from 'utils';

type Props = CommonProps & {
	award: Award;
	isUnlocked: boolean;
};

export const AwardThumbnail = (props: Props) => {
	const { colorTokens } = useTheme();
	const { award, isUnlocked, isLoading, size = Size.LARGE, onClick } = props;

	if (isLoading || !award) return <Skeleton size={size} />;
	const awardImg = getAwardThumbnail(award);

	return (
		<QueryBoundary fallback={null}>
			<Tooltip content={award.name}>
				<StyledAwardThumbnail
					size={size}
					isUnlocked={isUnlocked}
					colorTokens={colorTokens}
					onClick={onClick}>
					<img src={awardImg} alt="Award" loading="lazy" />
				</StyledAwardThumbnail>
			</Tooltip>
		</QueryBoundary>
	);
};

const StyledAwardThumbnail = styled.div.attrs(
	(
		props: Pick<Props, 'size' | 'onClick' | 'isUnlocked'> & {
			colorTokens: ColorTokens;
		},
	) => {
		const { size, onClick } = props;
		const style: React.CSSProperties = {
			minWidth: size,
			minHeight: size,
			maxWidth: size,
			maxHeight: size,
			cursor: onClick ? 'pointer' : 'help',
		};
		return { style };
	},
)<
	Pick<Props, 'size' | 'onClick' | 'isUnlocked'> & {
		colorTokens: ColorTokens;
	}
>`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
		filter: ${({ isUnlocked, colorTokens }) =>
			isUnlocked
				? `drop-shadow(0 0 5px ${colorTokens['semantic-color--idle']})`
				: ` contrast(0%) opacity(1%) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']}) drop-shadow(0 0 0 ${colorTokens['semantic-color--idle']})`};
	}
`;
