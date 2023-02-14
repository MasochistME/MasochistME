import React, { useState } from 'react';
import { useHistory } from 'react-router';

import styled from 'styled-components';

import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Button, Flex, Icon } from 'components';
import { Variant } from 'components/Button/types';
import { SubPage, Section, SectionProps } from 'containers';

import { CandidateSummary } from './CandidateSummary';
import { SteamNameInput } from './SteamNameInput';

export const TabJoin = () => {
	useActiveTab(TabDict.JOIN);
	// const { colorTokens } = useTheme();
	const [isServerError, setIsServerError] = useState<boolean>(false);
	const [steamName, setSteamName] = useState<string>('');

	return (
		<SubPage>
			<StyledWrapper column justify align>
				<Info isMobileOnly width="100%" />
				<StyledTitle>
					<h2>Points checker</h2>
					<Icon
						icon="CircleInfo"
						hoverText="Does not count family share games and possible badges"
					/>
				</StyledTitle>
				<SteamNameInput
					setSteamName={setSteamName}
					setIsServerError={setIsServerError}
				/>
				<CandidateSummary
					steamName={steamName}
					isServerError={isServerError}
					setIsServerError={setIsServerError}
				/>
			</StyledWrapper>
			<Info isDesktopOnly width="100%" maxWidth="450px" />
		</SubPage>
	);
};

type InfoProps = Partial<SectionProps>;
const Info = (props: InfoProps) => {
	const history = useHistory();
	const onGameListClick = () => {
		history.push('/games');
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