import React from 'react';
import styled from 'styled-components';

import { media } from 'shared/theme';
import { Flex, Button } from 'components';
import { Size } from 'utils';

export const ButtonsSocialMedia = (): JSX.Element => {
	const onButtonCuratorClick = () => {
		window.open('https://store.steampowered.com/curator/41289936', '_blank');
	};
	const onButtonPatreonClick = () => {
		window.open('https://www.patreon.com/pointonepercent', '_blank');
	};
	const onButtonDiscordClick = () => {
		window.open('https://discord.gg/NjAeT53kVb', '_blank');
	};

	return (
		<StyledButtonsSocialMedia>
			<Button
				size={Size.BIG}
				icon="fab fa-steam"
				tooltip="Our Steam curator"
				onClick={onButtonCuratorClick}
			/>
			<Button
				size={Size.BIG}
				icon="fab fa-discord"
				tooltip="Our Discord server"
				onClick={onButtonDiscordClick}
			/>
			<Button
				size={Size.BIG}
				icon="fab fa-patreon"
				tooltip="Support us!"
				onClick={onButtonPatreonClick}
			/>
		</StyledButtonsSocialMedia>
	);
};

const StyledButtonsSocialMedia = styled(Flex)`
	@media (min-width: ${media.bigPhones}) {
		gap: 4px;
	}
`;
