import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import styled from 'styled-components';

import { media, useTheme, ColorTokens } from 'styles';
import { ErrorFallback, Flex, Loader, QueryBoundary } from 'components';
import { Footer, Header, Navigation, SubHeader } from 'containers';

import { NotFound } from 'pages';

import { TabBadges } from './pages/TabBadges';
import { TabChangelog } from './pages/TabChangelog';
import { TabGame } from './pages/TabGame';
import { TabGames } from './pages/TabGames';
import { TabHistory } from './pages/TabHistory';
import { TabHome } from './pages/TabHome';
import { TabJoin } from './pages/TabJoin';
import { TabLeaderboards } from './pages/TabLeaderboards';
import { TabProfile } from './pages/TabProfile';
import { TabSupport } from './pages/TabSupport';
import { TabEvents } from 'pages/TabEvents';

export const App = (): JSX.Element => {
	const { colorTokens } = useTheme();

	return (
		<Router>
			<PageWrapper column align>
				<Flex column align width="100vw">
					<Header />
					<Navigation />
					<Content colorTokens={colorTokens}>
						<SubHeader />
						<Routes>
							<Route path="*" element={<NotFound />} />
							<Route
								path="/"
								element={
									<Boundary>
										<TabHome />
									</Boundary>
								}
							/>
							<Route path="/home" element={<Navigate to="/" />} />
							<Route
								path="/games"
								element={
									<Boundary>
										<TabGames />
									</Boundary>
								}
							/>
							<Route
								path="/leaderboards"
								element={
									<Boundary>
										<TabLeaderboards />
									</Boundary>
								}
							/>
							<Route
								path="/history"
								element={
									<Boundary>
										<TabHistory />
									</Boundary>
								}
							/>
							<Route
								path="/support"
								element={
									<Boundary>
										<TabSupport />
									</Boundary>
								}
							/>
							<Route
								path="/badges"
								element={
									<Boundary>
										<TabBadges />
									</Boundary>
								}
							/>
							<Route
								path="/events"
								element={
									<Boundary>
										<TabEvents />
									</Boundary>
								}
							/>
							<Route
								path="/profile/:id"
								element={
									<Boundary>
										<TabProfile />
									</Boundary>
								}
							/>
							<Route
								path="/game/:id"
								element={
									<Boundary>
										<TabGame />
									</Boundary>
								}
							/>
							<Route
								path="/join/*"
								element={
									<Boundary>
										<TabJoin />
									</Boundary>
								}
							/>
							<Route
								path="/changelog"
								element={
									<Boundary>
										<TabChangelog />
									</Boundary>
								}
							/>
						</Routes>
					</Content>
				</Flex>
				<Footer />
			</PageWrapper>
		</Router>
	);
};

const Boundary = ({ children }: React.PropsWithChildren<unknown>) => (
	<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
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
	width: 150rem;
	max-width: 100vw;
	position: relative;
	box-sizing: border-box;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}cc;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	@media (max-width: ${media.netbooks}) {
		width: 100%;
	}
`;
