import React from 'react';
import { Game, Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useMembers, useGames } from 'shared/hooks';
import { Spinner } from 'components';
import { Section, SectionTitle } from 'containers/Sidebar/components';

export const SectionTrivia = (): JSX.Element => {
	const { tiersData } = useTiers();
	const { membersData } = useMembers();
	const { gamesData: games } = useGames();

	const mapCurated = () => {
		if (!games || !tiersData) return [];

		return tiersData.map((tier: Tier) => (
			<li
				style={{ marginLeft: '30px' }}
				key={`tier-${tier.score}-${String(tier._id)}`}>
				<i className={tier.icon} />
				<span className="bold">{` : ${
					games.filter((game: Game) => game.tier === tier.id).length
				}`}</span>
			</li>
		));
	};

	return (
		<Section>
			<SectionTitle>Trivia</SectionTitle>
			{membersData.length && tiersData ? (
				<>
					<p>
						Users total: <span className="bold">{membersData.length}</span>
					</p>
					<p>Curated games:</p>
					<ul>
						<li style={{ marginLeft: '30px' }}>
							total: <span className="bold">{games.length}</span>
						</li>
						<ul>{mapCurated()}</ul>
					</ul>
				</>
			) : (
				<Spinner />
			)}
		</Section>
	);
};
