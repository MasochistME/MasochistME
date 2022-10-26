import styled from 'styled-components';

import { colors, fonts, media } from 'styles/theme/themeOld';
import { Flex, Icon, IconType, Tooltip, Skeleton, Size } from 'components';
import { useTheme, ColorTokens } from 'styles';

type Props = {
	label: React.ReactNode;
	sublabel?: React.ReactNode;
	title?: React.ReactNode;
	icon?: IconType;
	isLoading?: boolean;
};
export const StatBlock = (props: Props) => {
	const { colorTokens } = useTheme();
	const { label, sublabel, icon, title, isLoading } = props;

	return (
		<Tooltip content={title}>
			<StyledStatBlock colorTokens={colorTokens}>
				{icon && <Icon icon={icon} size={Size.TINY} />}
				{isLoading && <Skeleton width="100px" />}
				{!isLoading && (
					<Flex column align>
						<StyledStatBlockLabel>{label}</StyledStatBlockLabel>
						{sublabel && (
							<StyledStatBlockSublabel>{sublabel}</StyledStatBlockSublabel>
						)}
					</Flex>
				)}
			</StyledStatBlock>
		</Tooltip>
	);
};

const StyledStatBlock = styled(Flex)<{ colorTokens: ColorTokens }>`
	gap: 8px;
	flex-direction: row;
	align-items: center;
	padding: 8px 16px;
	border-radius: 64px;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
	border: 2px solid ${colors.yellow}66;
	color: ${colors.yellow};
	font-family: ${fonts.Dosis};
	cursor: help;
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
	line-height: 0.8em;
	white-space: nowrap;
	@media (max-width: ${media.tablets}) {
		font-size: 1.3em;
	}
`;

const StyledStatBlockSublabel = styled.span`
	font-size: 1em;
	font-weight: bold;
	color: ${colors.yellow}bb;
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
	gap: 8px;
	i {
		width: 16px;
	}
`;
