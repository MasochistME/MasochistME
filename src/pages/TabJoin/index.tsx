import React, { useState } from 'react';
import { useHistory } from 'react-router';

import styled from 'styled-components';

import { useTheme } from 'styles';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Alert, Button, Flex, Icon } from 'components';
import { Variant } from 'components/Button/types';
import { SubPage, Section, SectionProps } from 'containers';

import { validateSteamName } from './utils';
import { CandidateSummary } from './CandidateSummary';
import { SteamNameInput } from './SteamNameInput';

export const TabJoin = () => {
	useActiveTab(TabDict.JOIN);
	const { colorTokens } = useTheme();
	const [steamName, setSteamName] = useState<string>('');
	const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

	const { hasError, error } = validateSteamName(steamName);

	const onButtonGoClick = () => {
		if (hasError) {
			setIsAlertOpen(true);
			return;
		}
	};

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
					onButtonGoClick={onButtonGoClick}
				/>
				<Alert
					message={error}
					severity="error"
					isOpen={isAlertOpen}
					setIsOpen={setIsAlertOpen}
				/>
				<CandidateSummary steamName={steamName} />
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
