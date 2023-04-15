import styled from 'styled-components';

import { media, useTheme, ColorTokens } from 'styles';
import { Flex, Icon, IconType, Tooltip, Skeleton, Size } from 'components';
import { ColorMap } from 'utils';

type Props = {
	label: React.ReactNode;
	sublabel?: React.ReactNode;
	title?: React.ReactNode;
	icon?: IconType;
	isLoading?: boolean;
	tier?: ColorMap;
};
export const StatBlock = (props: Props) => {
	const { colorTokens } = useTheme();
	const {
		label,
		sublabel,
		icon,
		title,
		isLoading,
		tier = ColorMap.DEFAULT,
	} = props;

	const getTierColor = () => {
		if (tier === ColorMap.GOLD) return colorTokens['semantic-color--tier-4'];
		if (tier === ColorMap.WARNING)
			return colorTokens['semantic-color--warning-strong'];
		if (tier === ColorMap.SUCCESS) return colorTokens['semantic-color--tier-4'];
		if (tier === ColorMap.ERROR)
			return colorTokens['semantic-color--error-strong'];
		return colorTokens['semantic-color--active']; // Normal, default color
	};

	return (
		<Tooltip content={title}>
			<StyledStatBlock
				colorTokens={colorTokens}
				tierColor={getTierColor()}
				hasTooltip={!!title}>
				{icon && <Icon icon={icon} size={Size.TINY} />}
				{isLoading && <Skeleton width="10rem" />}
				{!isLoading && (
					<Flex column align>
						<StyledStatBlockLabel>{label}</StyledStatBlockLabel>
						{sublabel && (
							<StyledStatBlockSublabel tierColor={getTierColor()}>
								{sublabel}
							</StyledStatBlockSublabel>
						)}
					</Flex>
				)}
			</StyledStatBlock>
		</Tooltip>
	);
};

const StyledStatBlock = styled(Flex)<{
	colorTokens: ColorTokens;
	tierColor: string;
	hasTooltip: boolean;
}>`
	gap: var(--size-8);
	flex-direction: row;
	align-items: center;
	padding: var(--size-8) var(--size-16);
	border-radius: var(--border-radius-64);
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
	border: var(--size-2) solid ${({ tierColor }) => tierColor}66;
	color: ${({ tierColor }) => tierColor};
	font-family: var(--font-dosis);
	cursor: ${({ hasTooltip }) => (hasTooltip ? 'help' : 'inherit')};
	@media (max-width: ${media.tablets}) {
		padding: var(--size-4) var(--size-8);
		i {
			font-size: var(--font-size-15);
		}
	}
`;

const StyledStatBlockLabel = styled.span`
	line-height: var(--size-24);
	font-size: var(--font-size-24);
	font-weight: bold;
	white-space: nowrap;
	@media (max-width: ${media.tablets}) {
		font-size: var(--font-size-20);
	}
`;

const StyledStatBlockSublabel = styled.span<{ tierColor: string }>`
	line-height: var(--size-14);
	font-size: var(--font-size-14);
	font-weight: bold;
	color: ${({ tierColor }) => tierColor}bb;
	white-space: nowrap;
	@media (max-width: ${media.smallNetbooks}) {
		display: none;
	}
`;

StatBlock.Title = styled(Flex)`
	font-weight: bold;
`;

StatBlock.Subtitle = styled(Flex)`
	font-style: italic;
	align-items: center;
	gap: var(--size-8);
	i {
		width: var(--size-16);
	}
`;
