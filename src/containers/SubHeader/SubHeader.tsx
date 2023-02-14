import React from 'react';
import styled from 'styled-components';

import { fonts, media, useTheme, ColorTokens } from 'styles';
import { Tab, tabs } from 'configuration/tabs';
import { useAppContext } from 'context';
import { Flex, Icon, Size } from 'components';
import { UpdateStatus } from 'containers';

export const SubHeader = (): JSX.Element => {
	const { activeTab } = useAppContext();
	const { SH_URL, colorTokens } = useTheme();
	const findTab = () => tabs.find((tab: Tab) => tab.id === activeTab);

	return (
		<StyledSubHeader row>
			<StyledTitle row align colorTokens={colorTokens} shUrl={SH_URL}>
				<span className="subheader--icon__mobile">
					<Icon icon={findTab()?.icon ?? 'QuestionCircle'} size={Size.MEDIUM} />
				</span>
				<span className="subheader--icon__desktop">
					<Icon icon={findTab()?.icon ?? 'QuestionCircle'} size={Size.BIG} />
				</span>
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

const StyledTitle = styled(Flex)<{ colorTokens: ColorTokens; shUrl: string }>`
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: ${fonts.Cinzel};
	letter-spacing: 0.2em;
	letter-spacing: 0.3em;
	font-size: 2em;
	flex: 1 1 100%;
	height: 100%;
	padding: 0 24px;
	gap: 24px;
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	background-image: url(${({ shUrl }) => shUrl});
	background-repeat: no-repeat;
	background-position-x: right;
	background-size: cover;

	@media (max-width: ${media.tablets}) {
		letter-spacing: 0.1em;
		gap: 8px;
		padding: 0 12px;
	}

	h2 {
		font-size: 1em;
		font-weight: normal;
		text-shadow: 0px 0px 5px
			${({ colorTokens }) => colorTokens['common-color--shadow']};
		margin: 0;
	}

	& .subheader--icon__mobile {
		@media (min-width: ${media.tablets}) {
			display: none;
		}
	}
	& .subheader--icon__desktop {
		@media (max-width: ${media.tablets}) {
			display: none;
		}
	}
`;
