import React from 'react';
import styled from 'styled-components';

import { fonts, colors, media } from 'shared/theme';
import { Flex, IconButton } from 'components';

export const Header = (): JSX.Element => {
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
		<StyledHeader align>
			<span />
			<StyledHeaderTitle>
				Masochist.ME - games that masochists love
			</StyledHeaderTitle>
			<Flex>
				<IconButton icon="fab fa-steam" onClick={onButtonCuratorClick} />
				<IconButton icon="fab fa-discord" onClick={onButtonDiscordClick} />
				<IconButton icon="fab fa-patreon" onClick={onButtonPatreonClick} />
			</Flex>
		</StyledHeader>
	);
};

const StyledHeader = styled(Flex)`
	flex: 1 0 100%;
	min-width: 100%;
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
