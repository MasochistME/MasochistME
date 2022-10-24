import styled from 'styled-components';

import { colors, fonts, media } from 'shared/theme';

export type SectionProps = {
	isMobileOnly?: boolean;
	isDesktopOnly?: boolean;
	fullWidth?: boolean;
	title?: React.ReactNode;
	isCentered?: boolean;
	content: React.ReactNode;
	width?: string;
	height?: string;
} & Omit<React.CSSProperties, 'width' | 'height' | 'content' | 'translate'>;

export const Section = (props: SectionProps) => {
	const {
		isMobileOnly = false,
		isDesktopOnly = false,
		fullWidth,
		title,
		content,
		isCentered = true,
		...style
	} = props;
	return (
		<StyledSection
			fullWidth={fullWidth}
			isMobileOnly={isMobileOnly}
			isDesktopOnly={isDesktopOnly}
			{...style}>
			{title && <Section.Title isCentered={isCentered}>{title}</Section.Title>}
			<Section.Content>{content}</Section.Content>
		</StyledSection>
	);
};

type StyledProps = Omit<SectionProps, 'title' | 'content'>;

const StyledSection = styled.div.attrs((props: StyledProps) => {
	const {
		fullWidth: _1,
		isMobileOnly: _2,
		isDesktopOnly: _3,
		...style
	} = props;
	return {
		style,
	};
})<StyledProps>`
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
	${({ isMobileOnly, isDesktopOnly }) => {
		if (isMobileOnly)
			return `@media (min-width: ${media.netbooks}) {
			display:none;
		}`;
		if (isDesktopOnly)
			return `@media (max-width: ${media.netbooks}) {
			display:none;
		}`;
	}}
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
