import { Award } from '@masochistme/sdk/dist/v1/types';

import { QueryBoundary, Size, Skeleton } from 'components';
import { AwardTooltip } from 'containers/AwardTooltip';
import { CommonProps } from 'containers/CommonProps';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';
import { getAwardThumbnail } from 'utils';

type Props = CommonProps & {
	award: Award;
	isUnlocked: boolean;
	hasTooltip?: boolean;
};

export const AwardThumbnail = (props: Props): JSX.Element => {
	const { colorTokens } = useTheme();
	const {
		award,
		hasTooltip = true,
		isUnlocked,
		isLoading,
		size = Size.LARGE,
		onClick,
	} = props;

	if (isLoading || !award) return <Skeleton size={size} />;
	const awardImg = getAwardThumbnail(award);

	const thumbnail = (
		<StyledAwardThumbnail
			size={size}
			isUnlocked={isUnlocked}
			colorTokens={colorTokens}
			awardImg={awardImg}
			onClick={onClick}>
			{isUnlocked && <img src={awardImg} alt="Award" />}
		</StyledAwardThumbnail>
	);

	return (
		<QueryBoundary fallback={null}>
			{hasTooltip ? (
				<AwardTooltip award={award} isUnlocked={isUnlocked}>
					{thumbnail}
				</AwardTooltip>
			) : (
				thumbnail
			)}
		</QueryBoundary>
	);
};

const StyledAwardThumbnail = styled.div.attrs(
	(
		props: Pick<Props, 'size' | 'onClick' | 'isUnlocked'> & {
			awardImg: string;
			colorTokens: ColorTokens;
		},
	) => {
		const { size, onClick } = props;
		const style: React.CSSProperties = {
			minWidth: `${size}rem`,
			minHeight: `${size}rem`,
			maxWidth: `${size}rem`,
			maxHeight: `${size}rem`,
			cursor: onClick ? 'pointer' : 'help',
		};
		return { style };
	},
)<
	Pick<Props, 'size' | 'onClick' | 'isUnlocked'> & {
		awardImg: string;
		colorTokens: ColorTokens;
	}
>`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	overflow: hidden;

	${({ isUnlocked, colorTokens, awardImg }) =>
		!isUnlocked &&
		`
			background-color: ${colorTokens['semantic-color--idle']}};
			-webkit-mask-image: url(${awardImg});
			-webkit-mask-size: contain;
			-webkit-mask-repeat: no-repeat;
			-webkit-mask-position: center;
			mask-image: url(${awardImg});
			mask-size: contain;
			mask-repeat: no-repeat;
			mask-position: center;
			opacity: 0.8;
			transition: opacity 200ms;

			&:hover {
				opacity: 1;
			}
	`}

	img {
		min-width: ${({ size }) => size}rem;
		min-height: ${({ size }) => size}rem;
		max-width: ${({ size }) => size}rem;
		max-height: ${({ size }) => size}rem;
		object-fit: contain;
	}
`;
