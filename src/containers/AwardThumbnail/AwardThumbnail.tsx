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

export const AwardThumbnail = (props: Props): JSX.Element => {
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
					awardImg={awardImg}
					onClick={onClick}>
					{isUnlocked && <img src={awardImg} alt="Award" />}
				</StyledAwardThumbnail>
			</Tooltip>
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
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
`;
