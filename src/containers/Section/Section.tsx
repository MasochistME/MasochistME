import styled from 'styled-components';

import { colors, fonts } from 'shared/theme';

type Props = {
	fullWidth?: boolean;
	title?: string;
	content: React.ReactNode;
	children?: never;
} & Omit<React.CSSProperties, 'width' | 'height' | 'content' | 'translate'>;

export const Section = (props: Props) => {
	const { fullWidth, title, content, children: _, ...style } = props;
	return (
		<StyledSection fullWidth={fullWidth} {...style}>
			{title && <Section.Title>{title}</Section.Title>}
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
`;

Section.Title = styled.h3`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	padding: 4px;
	margin: 0;
	font-size: 1.3em;
	font-family: ${fonts.Dosis};
	text-transform: uppercase;
	background-color: ${colors.newDark};
	color: ${colors.superLightGrey};
	border-radius: 16px 16px 0 0;
`;

Section.Content = styled.div`
	width: 100%;
	padding: 12px;
`;
