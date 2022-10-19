import React from 'react';
import styled from 'styled-components';

import { Flex } from 'components';
import { colors, fonts } from 'shared/theme';
import { ButtonsSocialMedia } from 'containers';

export const Footer = () => {
	return (
		<StyledFooter align>
			<StyledFooterText>Arcyvilk @ 2022</StyledFooterText>
			<ButtonsSocialMedia />
		</StyledFooter>
	);
};

const StyledFooter = styled(Flex)`
	justify-self: flex-end;
	justify-content: space-between;
	width: 100%;
	padding: 0px 32px;
	background-color: ${colors.newDark};
	color: ${colors.mediumGrey};
	font-family: ${fonts.Raleway};
`;

const StyledFooterText = styled.h3``;
