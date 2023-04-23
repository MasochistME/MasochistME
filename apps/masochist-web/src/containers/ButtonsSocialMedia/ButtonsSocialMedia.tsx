import React from 'react';
import styled from 'styled-components';

import { media } from 'styles';
import { Flex, Button } from 'components';
import { Size } from 'components';
import { useMixpanel } from 'hooks';
import { curatorURL } from 'utils';
import { Variant } from 'components/Button/types';
import { useNavigate } from 'react-router';
import { t } from 'i18n';

type Props = {
	size?: Size;
	withJoinButton?: boolean;
};

export const ButtonsSocialMedia = (props: Props): JSX.Element => {
	const { size = Size.BIG, withJoinButton = false } = props;
	const { track } = useMixpanel();
	const navigate = useNavigate();

	const onButtonCuratorClick = () => {
		track(`button.curator.click`);
		window.open(curatorURL, '_blank');
	};
	const onButtonPatreonClick = () => {
		track(`button.patreon.click`);
		window.open('https://www.patreon.com/pointonepercent', '_blank');
	};
	const onButtonDiscordClick = () => {
		track(`button.discord.click`);
		window.open('https://discord.gg/NjAeT53kVb', '_blank');
	};
	const onJoinUsClick = () => {
		track(`button.joinus.click`);
		navigate('/join');
	};

	return (
		<StyledButtonsSocialMedia>
			{withJoinButton && (
				<Button
					size={Size.SMALL}
					label={t('button.social.join')}
					variant={Variant.PRIMARY}
					onClick={onJoinUsClick}
				/>
			)}
			<Button
				size={size}
				icon="Steam"
				tooltip={t('button.social.steam')}
				onClick={onButtonCuratorClick}
			/>
			<Button
				size={size}
				icon="Discord"
				tooltip={t('button.social.discord')}
				onClick={onButtonDiscordClick}
			/>
			<Button
				size={size}
				icon="Patreon"
				tooltip={t('button.social.support')}
				onClick={onButtonPatreonClick}
			/>
		</StyledButtonsSocialMedia>
	);
};

const StyledButtonsSocialMedia = styled(Flex)`
	@media (min-width: ${media.bigPhones}) {
		gap: var(--size-4);
	}
`;
