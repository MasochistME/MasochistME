import React from 'react';
import styled from 'styled-components';

import { Flex } from 'components';
import { colors, fonts, media } from 'shared/theme';
import { ButtonsSocialMedia } from 'containers';

export const Footer = () => {
	return (
		<StyledFooter align>
			<StyledFooterText>
				<a href="http://arcyvilk.com/" target="_blank">
					Copyright &copy; Arcyvilk 2016-2022. All rights reserved
				</a>
			</StyledFooterText>
			<ButtonsSocialMedia />
		</StyledFooter>
	);
};

const StyledFooter = styled(Flex)`
	justify-self: flex-end;
	justify-content: space-between;
	width: 100%;
	padding: 0px 24px;
	background-color: ${colors.newDark};
	color: ${colors.mediumGrey};
	font-family: ${fonts.Raleway};
`;

const StyledFooterText = styled.footer`
	margin: 0;
	text-align: left;
	@media (max-width: ${media.bigPhones}) {
		font-size: 1em;
	}
`;
