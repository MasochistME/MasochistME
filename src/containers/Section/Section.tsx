import styled from 'styled-components';

import { colors, fonts } from 'shared/theme';

type Props = {
	fullWidth?: boolean;
	title?: React.ReactNode;
	isCentered?: boolean;
	content: React.ReactNode;
	children?: never;
	width?: string;
	height?: string;
} & Omit<React.CSSProperties, 'width' | 'height' | 'content' | 'translate'>;

export const Section = (props: Props) => {
	const {
		fullWidth,
		title,
		content,
		isCentered = true,
		children: _,
		...style
	} = props;
	return (
		<StyledSection fullWidth={fullWidth} {...style}>
			{title && <Section.Title isCentered={isCentered}>{title}</Section.Title>}
			<Section.Content>{content}</Section.Content>
		</StyledSection>
	);
};

const StyledSection = styled.div.attrs(
	(props: Omit<Props, 'fullWidth' | 'children' | 'title' | 'content'>) => {
		const { ...style } = props;
		return { style };
	},
)<{ fullWidth?: boolean }>`
	flex: 0 1 auto;
	width: 450px;
	width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
	height: auto;
	box-sizing: border-box;
	border: 1px solid ${colors.newDark}88;
	border-radius: 16px;
	color: ${colors.superLightGrey};
	background-color: ${colors.newDarkBlue}cc;
	box-shadow: 0 0 15px ${colors.black};
`;

Section.Title = styled.h3<{ isCentered: boolean }>`
	display: flex;
	align-items: center;
	justify-content: ${({ isCentered }) =>
		isCentered ? 'center' : 'flex-start'};
	width: 100%;
	padding: 4px;
	margin: 0;
	font-size: 1.3em;
	font-family: ${fonts.Dosis};
	text-transform: uppercase;
	text-align: center;
	background-color: ${colors.newDark};
	color: ${colors.superLightGrey};
	border-radius: 16px 16px 0 0;
`;

Section.Content = styled.div`
	width: 100%;
	padding: 12px;
`;
