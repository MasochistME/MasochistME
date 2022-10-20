import React from 'react';
import styled from 'styled-components';

import { fonts, colors, media } from 'shared/theme';
import { Flex } from 'components';
import { ButtonsSocialMedia } from 'containers';

export const Header = (): JSX.Element => {
	return (
		<StyledHeader align>
			<span />
			<StyledHeaderTitle>
				<span>Masochist.ME</span>
				<StyledHeaderSubTitle>
					{' '}
					- games that masochists love
				</StyledHeaderSubTitle>
			</StyledHeaderTitle>
			<ButtonsSocialMedia />
		</StyledHeader>
	);
};

const StyledHeader = styled(Flex)`
	min-width: 100%;
	max-width: 100%;
	height: 70px;
	padding: 12px 32px;
	justify-content: space-between;
	background-color: ${colors.newDark};
	color: ${colors.lightGrey};
	font-family: ${fonts.Raleway};
`;

const StyledHeaderTitle = styled.h1`
	font-size: 1.2em;
	font-weight: normal;
	letter-spacing: 0.5em;
	margin: 0 10px;
	text-align: center;
	text-transform: uppercase;
	@media (max-width: ${media.tablets}) {
		letter-spacing: 0em;
	}
`;

const StyledHeaderSubTitle = styled.span`
	@media (max-width: ${media.smallTablets}) {
		display: none;
	}
`;
