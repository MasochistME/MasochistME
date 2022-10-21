import React from 'react';
import styled from 'styled-components';
import { Patron } from '@masochistme/sdk/dist/v1/types';

import patreon_button from 'shared/images/patreon.png';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { Flex, Spinner } from 'components';
import { Section, SubPage } from 'containers';

import { SupportTier } from './SupportTier';

const TabSupport = (): JSX.Element => {
	useActiveTab(TabDict.SUPPORT);

	const isLoading = true; // TODO temporary fix
	const isFetched = false; // TODO temporary fix

	const patrons: Patron[] = [];

	return (
		<SubPage>
			<StyledHallOfFame>
				{isLoading && <Spinner />}
				{isFetched &&
					patrons.map(patron => (
						<SupportTier key={`tier-${patron.tier}`} tier={patron.tier} />
					))}
			</StyledHallOfFame>
			<Section
				minWidth="450px"
				maxWidth="450px"
				title="Hall of Fame"
				content={
					<Flex column gap={8}>
						<div>
							...for all of those, who voluntarily donated their money to
							support <span style={{ fontWeight: 'bold' }}>MasochistME</span>.
							They are the ones funding the masochist.me domain and the hosting
							server, as well as assisting websites development.
						</div>
						<div>If you also wish to participate:</div>
						<a
							href="https://www.patreon.com/pointonepercent"
							rel="noopener noreferrer"
							target="_blank">
							<PatreonButton src={patreon_button} alt="Patreon button" />
						</a>
					</Flex>
				}
			/>
		</SubPage>
	);
};

export default TabSupport;

const StyledHallOfFame = styled.div`
	flex: 1 1 100%;
`;

const PatreonButton = styled.img`
	cursor: pointer;
	box-shadow: 0 0 10px #000;
	margin: 0;
	padding: 0;
	width: 200px;
`;
