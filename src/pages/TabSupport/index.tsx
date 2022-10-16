import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import patreon_button from 'shared/images/patreon.png';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';
import { Flex, Spinner, Wrapper } from 'components';

import { SupportTier } from './SupportTier';

export const TabSupport = (): JSX.Element => {
	useActiveTab(TabDict.SUPPORT);

	const patrons = useSelector((state: any) =>
		orderBy(state.patrons, ['tier'], ['desc']),
	);

	return (
		<Flex column>
			<Wrapper type="description">
				<div className="page-description">
					<Flex column align>
						<HallOfFame>Hall of Fame</HallOfFame>
						<p>
							...for all of those, who voluntarily donated their money to
							support <span style={{ fontWeight: 'bold' }}>0.1%</span>. They are
							the ones funding the masochist.me domain and the hosting server,
							as well as assisting websites development. Soon we&lsquo;ll also
							commission pixel art to enrich the website&lsquo;s graphics.
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
					</Flex>
				</div>
			</Wrapper>
			<Wrapper type="page">
				{patrons.length !== 0 ? (
					patrons.map((tier, index) => (
						<SupportTier key={`tier-${index}`} tier={tier} />
					))
				) : (
					<Spinner />
				)}
			</Wrapper>
		</Flex>
	);
};

const PatreonButton = styled.img`
	cursor: pointer;
	box-shadow: 0 0 10px #000;
	margin: 0;
	padding: 0;
	width: 200px;
`;

const HallOfFame = styled.p`
	font-size: 1.5em;
	border-bottom: 2px solid #ccc;
	padding: 10px 0 3px 0;
`;
