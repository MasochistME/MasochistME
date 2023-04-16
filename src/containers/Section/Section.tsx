import styled from 'styled-components';
import { useNavigate } from 'react-router';

import { media, useTheme, ColorTokens } from 'styles';
import { Button } from 'components';

export type SectionProps = {
	isMobileOnly?: boolean;
	isDesktopOnly?: boolean;
	fullWidth?: boolean;
	title?: React.ReactNode;
	isCentered?: boolean;
	anchorId?: string;
	content: React.ReactNode;
	width?: string;
	height?: string;
	isStyled?: boolean;
} & Omit<React.CSSProperties, 'width' | 'height' | 'content' | 'translate'>;

export const Section = (props: SectionProps) => {
	const { colorTokens } = useTheme();
	const navigate = useNavigate();
	const {
		isMobileOnly = false,
		isDesktopOnly = false,
		fullWidth,
		title,
		content,
		isCentered = true,
		anchorId,
		isStyled = true,
		...style
	} = props;

	const sanitizedAnchorId = anchorId?.replace(/[^a-zA-Z0-9]/gm, '');

	const jumpToAnchor = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		navigate(`#${sanitizedAnchorId}`);
	};

	return (
		<StyledSection
			fullWidth={fullWidth}
			isMobileOnly={isMobileOnly}
			isDesktopOnly={isDesktopOnly}
			colorTokens={colorTokens}
			isStyled={isStyled}
			{...style}>
			{title && (
				<Section.Title
					isCentered={isCentered}
					isStyled={isStyled}
					colorTokens={colorTokens}
					id={sanitizedAnchorId}>
					{title}
					{anchorId && <Button icon="Link" onClick={jumpToAnchor} />}
				</Section.Title>
			)}
			<Section.Content isStyled={isStyled}>{content}</Section.Content>
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
	width: 45rem;
	width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
	height: auto;
	box-sizing: border-box;
	border: ${({ isStyled, colorTokens }) =>
		isStyled ? `${colorTokens['semantic-color--idle']}}` : '0'};
	border-radius: var(--border-radius-16);
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	background-color: ${({ isStyled, colorTokens }) =>
		isStyled ? `${colorTokens['semantic-color--idle']}cc` : 'transparent'};
	box-shadow: ${({ isStyled, colorTokens }) =>
		isStyled
			? `0 0 var(--size-15) ${colorTokens['core-tertiary-bg']}}`
			: 'none'};

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

	* {
		max-width: 100%;
	}
`;

Section.Title = styled.h3<{
	isCentered: boolean;
	isStyled: boolean;
	colorTokens: ColorTokens;
	id: any;
}>`
	display: flex;
	align-items: center;
	justify-content: ${({ isCentered }) =>
		isCentered ? 'center' : 'flex-start'};
	width: 100%;
	margin: 0;
	padding: var(--size-4) var(--size-8);
	font-size: var(--font-size-18);
	font-family: var(--font-dosis);
	text-transform: uppercase;
	text-align: center;
	background-color: ${({ isStyled, colorTokens }) =>
		isStyled ? `${colorTokens['core-primary-bg']}}` : 'transparent'};
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	border-radius: var(--border-radius-16) var(--size-16) 0 0;
`;

Section.Content = styled.div<{ isStyled: boolean }>`
	width: 100%;
	padding: ${({ isStyled }) => (isStyled ? 'var(--size-12)' : 0)};
`;
