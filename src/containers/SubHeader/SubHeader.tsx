import React from 'react';
import styled from 'styled-components';

import { colors, fonts, media } from 'shared/theme';
import { Tab, tabs } from 'shared/config/tabs';
import { useAppContext } from 'context';
import { Flex } from 'components';
import { UpdateStatus } from 'containers';
import { useTheme, ColorTokens } from 'styles';

export const SubHeader = (): JSX.Element => {
	const { activeTab } = useAppContext();
	const { SH_URL, colorTokens } = useTheme();
	const findTab = () => tabs.find((tab: Tab) => tab.id === activeTab);

	return (
		<StyledSubHeader row>
			<StyledTitle row align colorTokens={colorTokens} shUrl={SH_URL}>
				<StyledSubHeaderIcon
					className={findTab()?.icon ?? 'fas fa-question-circle'}
				/>
				<h2>{findTab()?.text ?? '404'}</h2>
			</StyledTitle>
			<UpdateStatus />
		</StyledSubHeader>
	);
};

const StyledSubHeader = styled(Flex)`
	flex: 1 1 auto;
	text-transform: uppercase;
	width: 100%;
	height: 100px;
	box-sizing: border-box;
`;

const StyledSubHeaderIcon = styled.i`
	margin-right: 20px;
	font-size: 2.3em;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledTitle = styled(Flex)<{ colorTokens: ColorTokens; shUrl: string }>`
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: ${fonts.Cinzel};

	letter-spacing: 0.3em;
	font-size: 2em;
	flex: 1 1 100%;
	height: 100%;
	padding: 0 24px;
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	background-image: url(${({ shUrl }) => shUrl});
	background-repeat: no-repeat;
	background-position-x: right;
	background-size: cover;

	h2 {
		font-size: 1em;
		font-weight: normal;
		text-shadow: 0px 0px 5px ${colors.newDark};
		margin: 0;
	}
`;
