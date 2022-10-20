import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import patreon_button from 'shared/images/patreon.png';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { Spinner } from 'components';
import { HideOn, Section, SubPage } from 'containers';

import { SupportTier } from './SupportTier';

const TabSupport = (): JSX.Element => {
	useActiveTab(TabDict.SUPPORT);

	const isLoading = true; // TODO temporary fix
	const isFetched = false; // TODO temporary fix

	const patrons = useSelector((state: any) =>
		orderBy(state.patrons, ['tier'], ['desc']),
	);

	return (
		<SubPage>
			<StyledHallOfFame>
				{isLoading && <Spinner />}
				{isFetched &&
					patrons.map((tier, index) => (
						<SupportTier key={`tier-${index}`} tier={tier} />
					))}
			</StyledHallOfFame>
			<HideOn media="netbooks">
				<Section
					minWidth="450px"
					maxWidth="450px"
					title="Hall of Fame"
					content={
						<>
							<p>
								...for all of those, who voluntarily donated their money to
								support <span style={{ fontWeight: 'bold' }}>0.1%</span>. They
								are the ones funding the masochist.me domain and the hosting
								server, as well as assisting websites development. Soon
								we&lsquo;ll also commission pixel art to enrich the
								website&lsquo;s graphics.
							</p>
							<p>If you also wish to participate:</p>
							<p>
								<a
									href="https://www.patreon.com/pointonepercent"
									rel="noopener noreferrer"
									target="_blank">
									<PatreonButton src={patreon_button} alt="Patreon button" />
								</a>
							</p>
						</>
					}
				/>
			</HideOn>
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
