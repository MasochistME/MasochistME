import React from 'react';
import styled from 'styled-components';

import { media, useTheme, ColorTokens } from 'styles';
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
					<Icon icon={findTab()?.icon ?? 'QuestionCircle'} size={Size.SMALL} />
				</span>
				<span className="subheader--icon__desktop">
					<Icon icon={findTab()?.icon ?? 'QuestionCircle'} size={Size.MEDIUM} />
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
	height: 10rem;
	box-sizing: border-box;
`;

const StyledTitle = styled(Flex)<{ colorTokens: ColorTokens; shUrl: string }>`
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: var(--font-cinzel);
	letter-spacing: var(--size-3);
	flex: 1 1 100%;
	height: 100%;
	padding: 0 var(--size-24);
	gap: var(--size-24);
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	background-image: url(${({ shUrl }) => shUrl});
	background-repeat: no-repeat;
	background-position-x: right;
	background-size: cover;

	@media (max-width: ${media.tablets}) {
		letter-spacing: var(--size-1);
		gap: var(--size-16);
		padding: 0 var(--size-12);
	}

	h2 {
		all: unset;
		font-size: var(--font-size-28);
		line-height: var(--size-24);
		font-weight: normal;
		text-shadow: 0 0 var(--size-5)
			${({ colorTokens }) => colorTokens['common-color--shadow']};
		@media (max-width: ${media.tablets}) {
			font-size: var(--font-size-24);
		}
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
