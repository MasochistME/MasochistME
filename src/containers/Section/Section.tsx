import styled from 'styled-components';

import { colors, fonts } from 'shared/theme';

type Props = {
	fullWidth?: boolean;
	style?: React.CSSProperties;
	title?: string;
	content: React.ReactNode;
};

export const Section = (props: Props) => {
	const { fullWidth, style, title, content } = props;
	return (
		<StyledSection fullWidth={fullWidth} style={style}>
			{title && <Section.Title>{title}</Section.Title>}
			<Section.Content>{content}</Section.Content>
		</StyledSection>
	);
};

const StyledSection = styled.div.attrs(
	(props: Omit<Props, 'title' | 'content'>) => {
		return { style: props.style ?? {} };
	},
)<{ fullWidth?: boolean }>`
	min-width: 450px;
	width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
	height: auto;
	box-sizing: border-box;
	box-shadow: 0 0 20px ${colors.newDark};
	color: ${colors.superLightGrey};
	background-color: ${colors.darkBlue}cc;
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
`;

Section.Content = styled.div`
	width: 100%;
	padding: 12px;
`;
