import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { useLoadTiers, useInit } from 'shared/hooks';
import { media, colors } from 'shared/theme';
import { Flex } from 'components';
import { Footer, Header, Nav, SubHeader } from 'containers';
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
			<PageWrapper column align>
				<Flex column align width="100vw">
					<Header />
					<Nav />
					<Content>
						<SubHeader />
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
	position: relative;
	box-sizing: border-box;
	background-color: ${colors.black}88;
	color: ${colors.superLightGrey};
	@media (max-width: ${media.netbooks}) {
		width: 100%;
	}
`;
