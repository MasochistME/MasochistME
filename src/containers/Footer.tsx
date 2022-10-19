import React from 'react';
import styled from 'styled-components';

import { Flex, IconButton } from 'components';
import { colors, fonts } from 'shared/theme';

export const Footer = () => {
	const onButtonCuratorClick = () => {
		window.open('https://store.steampowered.com/curator/41289936', '_blank');
	};
	const onButtonPatreonClick = () => {
		window.open('https://www.patreon.com/pointonepercent', '_blank');
	};
	const onButtonDiscordClick = () => {
		window.open('https://discord.com/invite/cRNWDSam', '_blank');
	};

	return (
		<StyledFooter align>
			<StyledFooterText>Arcyvilk @ 2022</StyledFooterText>
			<Flex gap={4}>
				<IconButton icon="fab fa-steam" onClick={onButtonCuratorClick} />
				<IconButton icon="fab fa-discord" onClick={onButtonDiscordClick} />
				<IconButton icon="fab fa-patreon" onClick={onButtonPatreonClick} />
			</Flex>
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
