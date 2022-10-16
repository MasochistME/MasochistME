import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { SearchBar } from 'containers';
import { Wrapper, Flex, HoverIcon } from 'components';
import { changeGamesView } from 'shared/store/modules/Tabs';
import { useActiveTab, useTiers } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { CheckBoxGameChoice } from './CheckBoxGameChoice';
import { GameTiles } from './GameTiles';
import { GameList } from './GameList';
import { Tier } from '@masochistme/sdk/dist/v1/types';

export const TabGames = (): JSX.Element => {
	useActiveTab(TabDict.GAMES);

	const dispatch = useDispatch();
	const { tiersData } = useTiers();
	const gamesView = useSelector((state: any) => state.games.view);

	const onGameViewClick = () => {
		if (gamesView === 'tiles') {
			dispatch(changeGamesView('list'));
		}
		if (gamesView === 'list') {
			dispatch(changeGamesView('tiles'));
		}
	};

	return (
		<Flex column>
			<Wrapper type="description">
				<div className="page-description">
					<p>
						Here&lsquo;s the list of games that 0.1% curates, as well as the
						percentage completion comparision between our users.
					</p>
					<p>
						In the 0.1% community, we grade the ranks of our users by how many
						curated games they&lsquo;ve completed, as well as the difficulty of
						those games. Each game specifies their own difficulty in the
						description.
					</p>
					<p>
						The list also includes which three users completed the game first
						(with a gold, silver and bronze medals, respectively), as well as
						the user who has completed it the fastest based on Steam timestamps
						(with a trophy).
					</p>
				</div>

				{tiersData ? (
					<Flex row align style={{ justifyContent: 'space-between' }}>
						<div className="wrapper-choicebar">
							{tiersData.map((tier: Tier) => (
								<CheckBoxGameChoice
									key={`checkbox-game-${tier.id}`}
									tier={tier.id}
								/>
							))}
						</div>
						<SearchBar />
						<HoverIcon
							type="fas fa-th-list"
							isActive={gamesView === 'list'}
							onClick={onGameViewClick}
						/>
					</Flex>
				) : null}
			</Wrapper>
			<GameTiles />
			<GameList />
		</Flex>
	);
};
