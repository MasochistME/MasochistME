import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Main } from 'pages/Main';
import { useInit } from 'shared/hooks';

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

export default function App(): JSX.Element {
	const loaded = useInit();

	if (!loaded) return <div>Loading...</div>;

	return (
		<Main>
			<Router>
				<Switch>
					<Route exact path="/">
						<TabHome />
					</Route>
					<Route exact path="/home">
						<TabHome />
					</Route>
					<Route exact path="/games">
						<TabGames />
					</Route>
					<Route exact path="/ranking">
						<TabLeaderboards />
					</Route>
					<Route exact path="/events">
						<TabEvents />
					</Route>
					<Route exact path="/support">
						<TabSupport />
					</Route>
					<Route exact path="/badges">
						<TabBadges />
					</Route>
					<Route exact path="/profile/:id">
						<TabProfile />
					</Route>
					<Route exact path="/game/:id">
						<TabGame />
					</Route>
					<Route>
						<NotFound />
					</Route>
				</Switch>
			</Router>
		</Main>
	);
}
