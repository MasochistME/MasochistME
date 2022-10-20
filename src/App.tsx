import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { useLoadTiers, useInit } from 'shared/hooks';
import { media, colors } from 'shared/theme';
import { Fallback, Flex } from 'components';
import { Footer, Header, Nav, SubHeader } from 'containers';

import { NotFound } from 'pages';

const TabBadges = React.lazy(() => import('./pages/TabBadges'));
const TabEvents = React.lazy(() => import('./pages/TabEvents'));
const TabGame = React.lazy(() => import('./pages/TabGame'));
const TabGames = React.lazy(() => import('./pages/TabGames'));
const TabHome = React.lazy(() => import('./pages/TabHome'));
const TabLeaderboards = React.lazy(() => import('./pages/TabLeaderboards'));
const TabProfile = React.lazy(() => import('./pages/TabProfile'));
const TabSupport = React.lazy(() => import('./pages/TabSupport'));

// import {
// 	TabBadges,
// 	TabEvents,
// 	TabGame,
// 	TabGames,
// 	TabHome,
// 	TabLeaderboards,
// 	TabProfile,
// 	TabSupport,
// 	NotFound,
// } from 'pages';

export const App = (): JSX.Element => {
	const loaded = useInit();
	useLoadTiers();

	if (!loaded) return <div>Loading...</div>;

	return (
		<Router>
			<PageWrapper column align>
				<Flex column align width="100vw">
					<Header />
					<Nav />
					<Content>
						<SubHeader />
						<Switch>
							<Route exact path="/">
								<Suspense fallback={<Fallback />}>
									<TabHome />
								</Suspense>
							</Route>
							<Route exact path="/home">
								<Suspense fallback={<Fallback />}>
									<TabHome />
								</Suspense>
							</Route>
							<Route exact path="/games">
								<Suspense fallback={<Fallback />}>
									<TabGames />
								</Suspense>
							</Route>
							<Route exact path="/leaderboards">
								<Suspense fallback={<Fallback />}>
									<TabLeaderboards />
								</Suspense>
							</Route>
							<Route exact path="/events">
								<Suspense fallback={<Fallback />}>
									<TabEvents />
								</Suspense>
							</Route>
							<Route exact path="/support">
								<Suspense fallback={<Fallback />}>
									<TabSupport />
								</Suspense>
							</Route>
							<Route exact path="/badges">
								<Suspense fallback={<Fallback />}>
									<TabBadges />
								</Suspense>
							</Route>
							<Route exact path="/profile/:id">
								<Suspense fallback={<Fallback />}>
									<TabProfile />
								</Suspense>
							</Route>
							<Route exact path="/game/:id">
								<Suspense fallback={<Fallback />}>
									<TabGame />
								</Suspense>
							</Route>
							<Route>
								<NotFound />
							</Route>
						</Switch>
					</Content>
				</Flex>
				<Footer />
			</PageWrapper>
		</Router>
	);
};

const PageWrapper = styled(Flex)`
	box-sizing: border-box;
	min-width: 100vw;
	min-height: 100vh;
	justify-content: space-between;
`;

const Content = styled.div`
	width: 1500px;
	max-width: 100vw;
	position: relative;
	box-sizing: border-box;
	background-color: ${colors.black}88;
	color: ${colors.superLightGrey};
	@media (max-width: ${media.netbooks}) {
		width: 100%;
	}
`;
