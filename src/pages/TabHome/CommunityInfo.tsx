import React from 'react';
import styled from 'styled-components';

import { fonts } from 'styles';
import { Button, Flex } from 'components';
import { useMixpanel } from 'hooks';
import { useHistory } from 'react-router';
import { Variant } from 'components/Button/types';

export const CommunityInfo = () => {
	const history = useHistory();
	const { track } = useMixpanel();

	const onButtonDiscordClick = () => {
		track(`button.discord.click`);
		window.open('https://discord.gg/NjAeT53kVb', '_blank');
	};
	const onButtonJoinClick = () => {
		track(`button.join.click`);
		history.push(`/join`);
	};

	return (
		<StyledWrapper>
			<h1>Masochist.ME - games that masochists love</h1>
			<p>
				We are a tight-knit community of gamers who enjoy a good challenge. We
				select the most demanding and unique games that Steam has to offer,
				curate them and then participate in a friendly competition against each
				other in custom leaderboards.
			</p>
			<Flex gap={16}>
				<Button
					label="How to join"
					icon="DoorOpen"
					variant={Variant.PRIMARY}
					onClick={onButtonJoinClick}
				/>
				<Button
					label="Our Discord server"
					icon="Discord"
					variant={Variant.PRIMARY}
					onClick={onButtonDiscordClick}
				/>
			</Flex>
		</StyledWrapper>
	);
};

const StyledWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 1000px;
	font-family: ${fonts.Dosis};
	gap: 16px;
	padding: 16px 0;
	p {
		font-size: 1.2em;
	}
	& > * {
		margin: 0;
	}
`;
