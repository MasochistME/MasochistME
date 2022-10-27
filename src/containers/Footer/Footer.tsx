import React from 'react';
import styled from 'styled-components';

import { Flex } from 'components';
import { fonts, media } from 'styles/theme/themeOld';
import { ButtonsSocialMedia } from 'containers';
import { useTheme, ColorTokens } from 'styles';
import { Size } from 'components';

export const Footer = () => {
	const { colorTokens } = useTheme();

	return (
		<StyledFooter align colorTokens={colorTokens}>
			<StyledFooterText>
				<a href="http://arcyvilk.com/" target="_blank">
					Copyright &copy; Arcyvilk 2016-2022. All rights reserved
				</a>
			</StyledFooterText>
			<ButtonsSocialMedia size={Size.MEDIUM} />
		</StyledFooter>
	);
};

const StyledFooter = styled(Flex)<{ colorTokens: ColorTokens }>`
	justify-self: flex-end;
	justify-content: space-between;
	width: 100%;
	padding: 0px 24px;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']};
	color: ${({ colorTokens }) => colorTokens['semantic-color--disabled']};
	font-family: ${fonts.Raleway};
`;

const StyledFooterText = styled.footer`
	margin: 0;
	text-align: left;
	@media (max-width: ${media.bigPhones}) {
		font-size: 1em;
	}
`;
