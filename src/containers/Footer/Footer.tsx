import React from 'react';
import styled from 'styled-components';

import { Flex } from 'components';
import { media, useTheme, ColorTokens } from 'styles';
import { ButtonsSocialMedia } from 'containers';
import { Size } from 'components';
import { Link } from 'react-router-dom';
import { useAppContext } from 'context';
import { useMixpanel } from 'hooks';

export const Footer = () => {
	const { colorTokens } = useTheme();
	const { track } = useMixpanel();
	const { dev, setDev } = useAppContext();

	return (
		<StyledFooter align colorTokens={colorTokens}>
			<StyledFooterText>
				<div>
					Made by{' '}
					<a href="http://arcyvilk.com/" target="_blank">
						Arcyvilk
					</a>{' '}
					&copy; 2016-2023
				</div>
				<div>●</div>
				<div>
					<Link to="/changelog">Changelog</Link>
				</div>
				<div
					style={{ width: `${Size.SMALL}rem`, height: `${Size.SMALL}rem` }}
					onClick={() => {
						track('dev');
						setDev(dev + 1);
					}}
				/>
			</StyledFooterText>
			<ButtonsSocialMedia size={Size.MEDIUM} />
		</StyledFooter>
	);
};

const StyledFooter = styled(Flex)<{ colorTokens: ColorTokens }>`
	position: sticky;
	bottom: 0;
	justify-self: flex-end;
	justify-content: space-between;
	width: 100%;
	padding: 0 var(--size-24);
	box-shadow: 0 0 var(--size-30)
		${({ colorTokens }) => colorTokens['common-color--shadow']};
	background-color: ${({ colorTokens }) =>
		colorTokens['element-color--header-bg']};
	color: ${({ colorTokens }) => colorTokens['element-color--header-text']};
	font-family: var(--font-raleway);
	a {
		color: ${({ colorTokens }) => colorTokens['semantic-color--link-normal']};
	}
`;

const StyledFooterText = styled.footer`
	display: flex;
	margin: 0;
	text-align: left;
	align-items: center;
	gap: var(--size-8);
	font-size: var(--font-size-12);

	@media (max-width: ${media.bigPhones}) {
		font-size: var(--font-size-10);
	}
`;
