import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import styled from 'styled-components';

import { useLoadTiers } from 'hooks';
import { media, useTheme, ColorTokens } from 'styles';
import { FetchError, Flex, Loader, QueryBoundary } from 'components';
import { Footer, Header, Navigation, SubHeader } from 'containers';

import { NotFound } from 'pages';

import TabBadges from './pages/TabBadges';
import TabChangelog from './pages/TabChangelog';
import TabEvents from './pages/TabEvents';
import TabGame from './pages/TabGame';
import TabGames from './pages/TabGames';
import TabHome from './pages/TabHome';
import TabLeaderboards from './pages/TabLeaderboards';
import TabProfile from './pages/TabProfile';
import TabSupport from './pages/TabSupport';
// import TabRaces from 'pages/TabRaces';

export const App = (): JSX.Element => {
	const { colorTokens } = useTheme();
	// useLoadTiers();

	return (
		<Router>
			<PageWrapper column align>
				<Flex column align width="100vw">
					<Header />
					<Navigation />
					<Content colorTokens={colorTokens}>
						<SubHeader />
						<Switch>
							<Route exact path="/">
								<Boundary>
									<TabHome />
								</Boundary>
							</Route>
							<Route exact path="/home">
								<Redirect to="/" />
							</Route>
							<Route exact path="/games">
								<Boundary>
									<TabGames />
								</Boundary>
							</Route>
							<Route exact path="/leaderboards">
								<TabLeaderboards />
							</Route>
							<Route exact path="/events">
								<Boundary>
									<TabEvents />
								</Boundary>
							</Route>
							<Route exact path="/support">
								<TabSupport />
							</Route>
							<Route exact path="/badges">
								<Boundary>
									<TabBadges />
								</Boundary>
							</Route>
							{/* <Route exact path="/races">
							<Boundary>
									<TabRaces /></Boundary>
								</Route> */}
							<Route exact path="/profile/:id">
								<Boundary>
									<TabProfile />
								</Boundary>
							</Route>
							<Route exact path="/game/:id">
								<Boundary>
									<TabGame />
								</Boundary>
							</Route>
							<Route exact path="/changelog">
								<Boundary>
									<TabChangelog />
								</Boundary>
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

const Boundary = ({ children }: React.PropsWithChildren<unknown>) => (
	<QueryBoundary fallback={<Loader />} errorFallback={<FetchError />}>
		{children}
	</QueryBoundary>
);

const PageWrapper = styled(Flex)`
	box-sizing: border-box;
	min-width: 100vw;
	min-height: 100vh;
	justify-content: space-between;
`;

const Content = styled.div<{ colorTokens: ColorTokens }>`
	width: 1500px;
	max-width: 100vw;
	position: relative;
	box-sizing: border-box;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}cc;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	@media (max-width: ${media.netbooks}) {
		width: 100%;
	}
`;
