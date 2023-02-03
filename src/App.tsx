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
import { Flex } from 'components';
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
								<TabHome />
							</Route>
							<Route exact path="/home">
								<Redirect to="/" />
							</Route>
							<Route exact path="/games">
								<TabGames />
							</Route>
							<Route exact path="/leaderboards">
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
							{/* <Route exact path="/races">
									<TabRaces />
								</Route> */}
							<Route exact path="/profile/:id">
								<TabProfile />
							</Route>
							<Route exact path="/game/:id">
								<TabGame />
							</Route>
							<Route exact path="/changelog">
								<TabChangelog />
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
