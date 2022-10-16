import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Page from 'components/pages';
import useInit from './init';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
	const loaded = useInit();

	return (
		<QueryClientProvider client={queryClient}>
			{loaded ? (
				<Router>
					<Switch>
						<Route exact path="/">
							<Page page="home" />
						</Route>
						<Route exact path="/home">
							<Page page="home" />
						</Route>
						<Route exact path="/games">
							<Page page="games" />
						</Route>
						<Route exact path="/ranking">
							<Page page="ranking" />
						</Route>
						<Route exact path="/events">
							<Page page="events" />
						</Route>
						<Route exact path="/support">
							<Page page="support" />
						</Route>
						<Route exact path="/badges">
							<Page page="badges" />
						</Route>
						<Route exact path="/profile/:id">
							<Page page="profile" />
						</Route>
						<Route exact path="/game/:id">
							<Page page="game" />
						</Route>
						{/** other */}
						<Route>
							<Page page="notfound" />
						</Route>
					</Switch>
				</Router>
			) : (
				<div>Loading...</div>
			)}
		</QueryClientProvider>
	);
}
