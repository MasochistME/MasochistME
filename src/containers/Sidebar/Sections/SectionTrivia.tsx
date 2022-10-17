import React from 'react';
import { useSelector } from 'react-redux';

import { useTiers, useMembers } from 'shared/hooks';
import { Spinner } from 'components';
import { Section, SectionTitle } from 'containers/Sidebar/components';

export const SectionTrivia = (): JSX.Element => {
	const { tiersData } = useTiers();
	const { membersData } = useMembers();
	const games = useSelector((state: any) => state.games.list);

	const mapCurated = () => {
		if (games && tiersData) {
			return tiersData.map((tier: any, index: number) => {
				return (
					<li style={{ marginLeft: '30px' }} key={`${tier.score}-${index}`}>
						<i className={tier.icon} />
						<span className="bold">{` : ${
							games.filter(
								(game: any) => Number(game.rating) === Number(tier.id),
							).length
						}`}</span>
					</li>
				);
			});
		}
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
