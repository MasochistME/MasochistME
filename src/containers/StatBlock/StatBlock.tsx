import styled from 'styled-components';

import { colors, fonts, media } from 'shared/theme';
import { Flex, Tooltip } from 'components';

type Props = {
	label: React.ReactNode;
	sublabel?: React.ReactNode;
	title?: React.ReactNode;
	icon?: string;
};
export const StatBlock = (props: Props) => {
	const { label, sublabel, icon, title } = props;
	return (
		<Tooltip content={title}>
			<StyledStatBlock>
				{icon && <i className={icon} />}
				<Flex column align>
					<StyledStatBlockLabel>{label}</StyledStatBlockLabel>
					{sublabel && (
						<StyledStatBlockSublabel>{sublabel}</StyledStatBlockSublabel>
					)}
				</Flex>
			</StyledStatBlock>
		</Tooltip>
	);
};

const StyledStatBlock = styled(Flex)`
	gap: 8px;
	flex-direction: row;
	align-items: center;
	padding: 8px 16px;
	border-radius: 64px;
	background-color: ${colors.newDark}99;
	border: 2px solid ${colors.yellow}66;
	color: ${colors.yellow};
	font-family: ${fonts.Dosis};
	cursor: help;
	i {
		font-size: 1.8em;
	}
`;

const StyledStatBlockLabel = styled.span`
	font-size: 2em;
	font-weight: bold;
	line-height: 0.8em;
`;

const StyledStatBlockSublabel = styled.span`
	font-size: 1em;
	font-weight: bold;
	color: ${colors.yellow}bb;
	@media (max-width: ${media.smallNetbooks}) {
		display: none;
	}
`;
