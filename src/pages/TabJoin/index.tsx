import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import styled from 'styled-components';

import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Button, Flex, Icon } from 'components';
import { Variant } from 'components/Button/types';
import { SubPage, Section, SectionProps } from 'containers';

import { CandidateSummary } from './CandidateSummary';
import { SteamNameInput } from './SteamNameInput';
import { useSearchParams } from 'react-router-dom';

export const TabJoin = () => {
	useActiveTab(TabDict.JOIN);
	const [, setSearchParams] = useSearchParams();
	const [steamUrl, setSteamUrl] = useState<string>('');

	useEffect(() => {
		if (steamUrl.length) setSearchParams({ url: steamUrl });
	}, [steamUrl]);

	return (
		<SubPage>
			<StyledWrapper column justify align>
				<Info isMobileOnly width="100%" />
				<StyledTitle>
					<h2>Points checker</h2>
					<Icon
						icon="CircleInfo"
						hoverText="Does not count possible badges and family share games (unless you played them less than two weeks ago)"
					/>
				</StyledTitle>
				<SteamNameInput setSteamUrl={setSteamUrl} />
				<CandidateSummary steamUrl={steamUrl} />
			</StyledWrapper>
			<Info isDesktopOnly width="100%" maxWidth="450px" />
		</SubPage>
	);
};

type InfoProps = Partial<SectionProps>;
const Info = (props: InfoProps) => {
	const navigate = useNavigate();
	const onGameListClick = () => {
		navigate('/games');
	};

	return (
		<Section
			title="Rules"
			width="100%"
			maxWidth="600px"
			content={
				<>
					<p>
						To join, you have to have at least 20 points worth of games curated
						on MasochistME. The list of endorsed games is available under the
						GAMES tab.
					</p>
					<Button
						icon="Gamepad"
						label="Game list"
						variant={Variant.PRIMARY}
						onClick={onGameListClick}
					/>
					<p>
						A single game cannot give you more than 10 points - this is to
						encourage variety.
					</p>
				</>
			}
			{...props}
		/>
	);
};

const StyledWrapper = styled(Flex)`
	width: 100%;
	align-items: flex-start;
	flex-wrap: wrap;
	gap: 8px;
`;

const StyledTitle = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
	h2 {
		margin: 0;
	}
`;
