import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { useLoadTiers, useInit } from 'shared/hooks';
import { media, colors } from 'shared/theme';
import { Flex, Wrapper } from 'components';
import { Header, SubHeader, Nav } from 'containers';
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
			<Flex column justify align>
				<Header />
				<Nav />
				<Content>
					<SubHeader />
					<SubPage>
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
					</SubPage>
				</Content>
			</Flex>
			<Wrapper type="footer" />
		</Router>
	);
};

const Content = styled.div`
	position: relative;
	width: 1500px;
	height: auto;
	box-sizing: border-box;
	color: ${colors.superLightGrey};
	@media (max-width: ${media.netbooks}) {
		width: 100%;
	}
`;

const SubPage = styled(Flex)`
	margin-top: 32px;
`;
