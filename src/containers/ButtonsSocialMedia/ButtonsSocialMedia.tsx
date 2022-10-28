import React from 'react';
import styled from 'styled-components';

import { media } from 'styles';
import { Flex, Button } from 'components';
import { Size } from 'components';

type Props = {
	size?: Size;
};

export const ButtonsSocialMedia = (props: Props): JSX.Element => {
	const { size = Size.BIG } = props;
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
				size={size}
				icon="Steam"
				tooltip="Our Steam curator"
				onClick={onButtonCuratorClick}
			/>
			<Button
				size={size}
				icon="Discord"
				tooltip="Our Discord server"
				onClick={onButtonDiscordClick}
			/>
			<Button
				size={size}
				icon="Patreon"
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
