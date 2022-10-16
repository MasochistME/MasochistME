import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Main } from 'pages/Main';
import { useLoadTiers, useInit } from 'shared/hooks';

import {
	TabBadges,
	TabEvents,
	TabGame,
	TabGames,
	TabHome,
	TabLeaderboards,
	TabProfile,
	TabSupport,
	NotFound,
} from 'pages';

export const App = (): JSX.Element => {
	const loaded = useInit();
	useLoadTiers();

	if (!loaded) return <div>Loading...</div>;

	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Main tab={<TabHome />} />
				</Route>
				<Route exact path="/home">
					<Main tab={<TabHome />} />
				</Route>
				<Route exact path="/games">
					<Main tab={<TabGames />} />
				</Route>
				<Route exact path="/ranking">
					<Main tab={<TabLeaderboards />} />
				</Route>
				<Route exact path="/events">
					<Main tab={<TabEvents />} />
				</Route>
				<Route exact path="/support">
					<Main tab={<TabSupport />} />
				</Route>
				<Route exact path="/badges">
					<Main tab={<TabBadges />} />
				</Route>
				<Route exact path="/profile/:id">
					<Main tab={<TabProfile />} />
				</Route>
				<Route exact path="/game/:id">
					<Main tab={<TabGame />} />
				</Route>
				<Route>
					<Main tab={<NotFound />} />
				</Route>
			</Switch>
		</Router>
	);
};
