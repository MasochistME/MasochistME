import React from 'react';
import styled from 'styled-components';
import { fonts, colors, media } from 'shared/theme';
import Flex from './layout/Flex';
import { IconButton } from './IconButton';

const WrapperHeader = styled.div`
	display: flex;
	width: 100%;
	height: 70px;
	align-items: center;
	justify-content: space-evenly;
	background-color: ${colors.newDark};
	// background-image: url('../../shared/images/bg_nav.png');
	color: ${colors.lightGrey};
	font-family: ${fonts.Raleway};
	div {
		margin: 10px;
	}
`;
const HeaderMotto = styled.p`
	font-size: 1.2em;
	letter-spacing: 0.5em;
	margin: 0 10px;
	text-align: center;
	text-transform: uppercase;
	@media (max-width: ${media.tablets}) {
		letter-spacing: 0em;
	}
`;

export default function Header(): JSX.Element {
	const onButtonCuratorClick = () => {
		window.open('https://store.steampowered.com/curator/41289936', '_blank');
	};
	const onButtonPatreonClick = () => {
		window.open('https://www.patreon.com/pointonepercent', '_blank');
	};

	return (
		<WrapperHeader>
			<span />
			<HeaderMotto>Masochist.ME - games that masochists love</HeaderMotto>
			<Flex>
				<IconButton icon="fab fa-steam" onClick={onButtonCuratorClick} />
				<IconButton icon="fab fa-patreon" onClick={onButtonPatreonClick} />
			</Flex>
		</WrapperHeader>
	);
}
