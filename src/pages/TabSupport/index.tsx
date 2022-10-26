import React from 'react';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import { PatreonTier } from '@masochistme/sdk/dist/v1/types';

import { usePatreonTiers } from 'sdk';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';
import { Flex, Spinner } from 'components';
import { Section, SectionProps, SubPage } from 'containers';

import { SupportTier } from './SupportTier';

const TabSupport = (): JSX.Element => {
	useActiveTab(TabDict.SUPPORT);

	const { patreonTiersData, isLoading, isFetched } = usePatreonTiers();

	const sortedPatreonTiers = orderBy(patreonTiersData, ['tier'], ['desc']);

	return (
		<SubPage>
			<StyledHallOfFame>
				<TabSupportInfo isMobileOnly />
				{isLoading && <Spinner />}
				{isFetched &&
					sortedPatreonTiers.map((patreonTier: PatreonTier) => (
						<SupportTier
							key={`tier-${patreonTier.tier}`}
							patreonTier={patreonTier}
						/>
					))}
			</StyledHallOfFame>
			<TabSupportInfo isDesktopOnly width="100%" maxWidth="450px" />
		</SubPage>
	);
};

const TabSupportInfo = (props: Partial<SectionProps>): JSX.Element => {
	return (
		<Section
			{...props}
			title="Hall of Fame"
			content={
				<Flex column gap={8}>
					<div>Thank you for using MasochistME website!</div>
					<div>
						MasochistME is able to exist and thrive thanks to your donations.
						It's the community's effort that makes this place alive.
					</div>
					<div>Donations cover the cost of:</div>
					<ul>
						<li>MasochistME server and domain,</li>
						<li>Dr. Fetus Bot' server,</li>
						<li>Arcyvilk's coffee for the long coding nights.</li>
					</ul>
					<div>If you also want to contribute:</div>
					{/** TODO add ko-fi and Patreon link */}
					<a
						href="https://www.patreon.com/pointonepercent"
						rel="noopener noreferrer"
						target="_blank">
						<PatreonButton
							src="http://cdn.masochist.me/assets/patreon.png"
							alt="Patreon button"
						/>
					</a>
				</Flex>
			}
		/>
	);
};

export default TabSupport;

const StyledHallOfFame = styled(Flex)`
	flex-direction: column;
	flex: 1 1 100%;
	gap: 16px;
`;

const PatreonButton = styled.img`
	cursor: pointer;
	box-shadow: 0 0 10px #000;
	margin: 0;
	padding: 0;
	width: 200px;
`;
