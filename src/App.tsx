import React, { Suspense } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import styled from 'styled-components';

import { useLoadTiers } from 'hooks';
import { media, colors } from 'shared/theme';
import { Loader, Flex } from 'components';
import { Footer, Header, Navigation, SubHeader } from 'containers';

import { NotFound } from 'pages';

const TabBadges = React.lazy(() => import('./pages/TabBadges'));
const TabEvents = React.lazy(() => import('./pages/TabEvents'));
const TabGame = React.lazy(() => import('./pages/TabGame'));
const TabGames = React.lazy(() => import('./pages/TabGames'));
const TabHome = React.lazy(() => import('./pages/TabHome'));
const TabLeaderboards = React.lazy(() => import('./pages/TabLeaderboards'));
const TabProfile = React.lazy(() => import('./pages/TabProfile'));
const TabSupport = React.lazy(() => import('./pages/TabSupport'));

export const App = (): JSX.Element => {
	useLoadTiers();

	return (
		<Router>
			<PageWrapper column align>
				<Flex column align width="100vw">
					<Header />
					<Navigation />
					<Content>
						<SubHeader />
						<Switch>
							<Route exact path="/">
								<Suspense fallback={<Loader />}>
									<TabHome />
								</Suspense>
							</Route>
							<Route exact path="/home">
								<Redirect to="/" />
							</Route>
							<Route exact path="/games">
								<Suspense fallback={<Loader />}>
									<TabGames />
								</Suspense>
							</Route>
							<Route exact path="/leaderboards">
								<Suspense fallback={<Loader />}>
									<TabLeaderboards />
								</Suspense>
							</Route>
							<Route exact path="/events">
								<Suspense fallback={<Loader />}>
									<TabEvents />
								</Suspense>
							</Route>
							<Route exact path="/support">
								<Suspense fallback={<Loader />}>
									<TabSupport />
								</Suspense>
							</Route>
							<Route exact path="/badges">
								<Suspense fallback={<Loader />}>
									<TabBadges />
								</Suspense>
							</Route>
							<Route exact path="/profile/:id">
								<Suspense fallback={<Loader />}>
									<TabProfile />
								</Suspense>
							</Route>
							<Route exact path="/game/:id">
								<Suspense fallback={<Loader />}>
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
	background-color: ${colors.newDark}cc;
	color: ${colors.superLightGrey};
	@media (max-width: ${media.netbooks}) {
		width: 100%;
	}
`;
