import styled from 'styled-components';

import { fonts, media, useTheme, ColorTokens } from 'styles';
import { Flex, Icon, IconType, Tooltip, Size } from 'components';
import { ColorMap } from 'utils';

type Props = {
	label: React.ReactNode;
	sublabel?: React.ReactNode;
	title?: React.ReactNode;
	icon?: IconType;
	tier?: ColorMap;
};
export const StatBlock = (props: Props) => {
	const { colorTokens } = useTheme();
	const { label, sublabel, icon, title, tier = ColorMap.DEFAULT } = props;

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
				<Flex column align>
					<StyledStatBlockLabel>{label}</StyledStatBlockLabel>
					{sublabel && (
						<StyledStatBlockSublabel tierColor={getTierColor()}>
							{sublabel}
						</StyledStatBlockSublabel>
					)}
				</Flex>
			</StyledStatBlock>
		</Tooltip>
	);
};

const StyledStatBlock = styled(Flex)<{
	colorTokens: ColorTokens;
	tierColor: string;
	hasTooltip: boolean;
}>`
	gap: 8px;
	flex-direction: row;
	align-items: center;
	padding: 8px 16px;
	border-radius: 64px;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
	border: 2px solid ${({ tierColor }) => tierColor}66;
	color: ${({ tierColor }) => tierColor};
	font-family: ${fonts.Dosis};
	cursor: ${({ hasTooltip }) => (hasTooltip ? 'help' : 'inherit')};
	@media (max-width: ${media.tablets}) {
		padding: 4px 8px;
		i {
			font-size: 1.5em;
		}
	}
`;

const StyledStatBlockLabel = styled.span`
	font-size: 2em;
	font-weight: bold;
	line-height: 1em;
	white-space: nowrap;
	@media (max-width: ${media.tablets}) {
		font-size: 1.3em;
	}
`;

const StyledStatBlockSublabel = styled.span<{ tierColor: string }>`
	font-size: 1em;
	font-weight: bold;
	color: ${({ tierColor }) => tierColor}bb;
	white-space: nowrap;
	line-height: 1em;
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
	gap: 8px;
	i {
		width: 16px;
	}
`;
