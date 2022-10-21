import React from 'react';
import styled from 'styled-components';

import headerImg from 'shared/images/miniheader.png';
import { colors, fonts, media } from 'shared/theme';
import { Tab, tabs } from 'shared/config/tabs';
import { useAppContext } from 'shared/store/context';
import { Flex } from 'components';
import { UpdateStatus } from 'containers';

export const SubHeader = (): JSX.Element => {
	const { activeTab } = useAppContext();
	const findTab = () => tabs.find((tab: Tab) => tab.id === activeTab);

	return (
		<StyledSubHeader row>
			<StyledTitle row align>
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

const StyledTitle = styled(Flex)`
	color: ${colors.superLightGrey};
	font-family: ${fonts.Cinzel};

	letter-spacing: 0.3em;
	font-size: 2em;
	flex: 1 1 100%;
	height: 100%;
	padding: 0 24px;
	background-color: ${colors.superDarkGrey};
	background-image: url(${headerImg});
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
