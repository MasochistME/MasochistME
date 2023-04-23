import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import styled from 'styled-components';

import { useActiveTab, useMixpanel } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Button, Flex } from 'components';
import { Variant } from 'components/Button/types';
import { SubPage, Section, SectionProps } from 'containers';

import { CandidateSummary } from './CandidateSummary';
import { SteamNameInput } from './SteamNameInput';
import { useSearchParams } from 'react-router-dom';
import { curatorURL } from 'utils';

export const TabJoin = () => {
	useActiveTab(TabDict.JOIN);
	const [, setSearchParams] = useSearchParams();
	const [steamUrl, setSteamUrl] = useState<string>('');

	useEffect(() => {
		if (steamUrl.length) setSearchParams({ url: steamUrl });
	}, [steamUrl]);

	return (
		<SubPage>
			<StyledWrapper justify>
				<Section
					flex="1 1 75rem"
					isStyled={false}
					title="Points checker"
					content={
						<Flex column gap="var(--size-16)">
							<SteamNameInput setSteamUrl={setSteamUrl} />
							<CandidateSummary steamUrl={steamUrl} />
						</Flex>
					}
				/>
				<Flex column gap="var(--size-16)" flex="1 1 30%">
					<CommunityInfo />
					<JoinInfo />
				</Flex>
			</StyledWrapper>
		</SubPage>
	);
};

type InfoProps = Partial<SectionProps>;
const CommunityInfo = () => {
	const navigate = useNavigate();
	const { track } = useMixpanel();

	const onButtonDiscordClick = () => {
		track(`button.discord.click`);
		window.open('https://discord.gg/NjAeT53kVb', '_blank');
	};
	const onButtonCuratorClick = () => {
		track(`button.discord.click`);
		window.open(curatorURL, '_blank');
	};
	const onButtonSupportClick = () => {
		track(`button.support.click`);
		navigate('/support');
	};

	return (
		<Section
			title="About us"
			content={
				<StyledInfo>
					<div>
						We are a tight-knit community of gamers who enjoy a good challenge.
						We select the most demanding and unique games that Steam has to
						offer, curate them and then participate in a friendly competition
						against each other in custom leaderboards.
					</div>
					<Flex gap={16} flexWrap="wrap" justify>
						<Button
							label="Discord server"
							icon="Discord"
							variant={Variant.PRIMARY}
							onClick={onButtonDiscordClick}
						/>
						<Button
							label="Steam curator"
							icon="Steam"
							variant={Variant.PRIMARY}
							onClick={onButtonCuratorClick}
						/>
						<Button
							label="Support us!"
							icon="Heart"
							variant={Variant.PRIMARY}
							onClick={onButtonSupportClick}
						/>
					</Flex>
				</StyledInfo>
			}
		/>
	);
};

const JoinInfo = (props: InfoProps) => {
	return (
		<Section
			title="How to join us?"
			width="100%"
			content={
				<StyledInfo>
					<div>
						To join, you need
						<span style={{ fontWeight: 600 }}>at least 20 points</span> worth of
						games curated on MasochistME. The list of endorsed games is
						available under the GAMES tab. A single game cannot give you more
						than 10 points - this is to encourage variety.
					</div>
					<div>
						You can check how many points you have by using our point checker.
						Remember to set your Steam profile and game list to public first. As
						a candidate, you can update your profile once a week.
					</div>
					<div>
						<span style={{ fontWeight: 600 }}>→ Eligible to join?</span> Copy
						the URL of this page with your point checker results and post them
						in our Discord! Mods will get back to you.
					</div>
				</StyledInfo>
			}
			{...props}
		/>
	);
};

const StyledWrapper = styled(Flex)`
	width: 100%;
	align-items: flex-start;
	flex-wrap: wrap;
	gap: var(--size-16);
`;

const StyledInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--size-8);
`;
