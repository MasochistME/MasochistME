import styled from 'styled-components';

import { fonts, media } from 'styles/theme/themeOld';
import { useTheme, ColorTokens } from 'styles';

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
	const { colorTokens } = useTheme();
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
			colorTokens={colorTokens}
			{...style}>
			{title && (
				<Section.Title isCentered={isCentered} colorTokens={colorTokens}>
					{title}
				</Section.Title>
			)}
			<Section.Content>{content}</Section.Content>
		</StyledSection>
	);
};

type StyledProps = Omit<SectionProps, 'title' | 'content'> & {
	colorTokens: ColorTokens;
};

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
	border: 1px solid ${({ colorTokens }) => colorTokens['core-primary-bg']}88;
	border-radius: 16px;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	background-color: ${({ colorTokens }) =>
		colorTokens['semantic-color-idle']}cc;
	box-shadow: 0 0 15px ${({ colorTokens }) => colorTokens['core-tertiary-bg']};
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

Section.Title = styled.h3<{ isCentered: boolean; colorTokens: ColorTokens }>`
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
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']};
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	border-radius: 16px 16px 0 0;
`;

Section.Content = styled.div`
	width: 100%;
	padding: 12px;
`;
