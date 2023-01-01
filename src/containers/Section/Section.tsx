import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { sha256 } from 'utils';
import { fonts, media, useTheme, ColorTokens } from 'styles';
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
} & Omit<React.CSSProperties, 'width' | 'height' | 'content' | 'translate'>;

export const Section = (props: SectionProps) => {
	const { colorTokens } = useTheme();
	const history = useHistory();
	const {
		isMobileOnly = false,
		isDesktopOnly = false,
		fullWidth,
		title,
		content,
		isCentered = true,
		anchorId,
		...style
	} = props;

	const sanitizedAnchorId = anchorId?.replace(/[^a-zA-Z0-9]/gm, '');

	const jumpToAnchor = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		history.push(`#${sanitizedAnchorId}`);
	};

	return (
		<StyledSection
			fullWidth={fullWidth}
			isMobileOnly={isMobileOnly}
			isDesktopOnly={isDesktopOnly}
			colorTokens={colorTokens}
			{...style}>
			{title && (
				<Section.Title
					isCentered={isCentered}
					colorTokens={colorTokens}
					id={sanitizedAnchorId}>
					{title}
					{anchorId && <Button icon="Link" onClick={jumpToAnchor} />}
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
		colorTokens['semantic-color--idle']}cc;
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

	* {
		max-width: 100%;
	}
`;

Section.Title = styled.h3<{
	isCentered: boolean;
	colorTokens: ColorTokens;
	id: any;
}>`
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
