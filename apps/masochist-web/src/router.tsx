import React, { ReactNode } from 'react';
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

export const Routing = (): JSX.Element => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<TabHome />} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/games" element={<TabGames />} />
          <Route path="/leaderboards" element={<TabLeaderboards />} />
          <Route path="/history" element={<TabHistory />} />
          <Route path="/support" element={<TabSupport />} />
          <Route path="/badges" element={<TabBadges />} />
          <Route path="/events" element={<TabEvents />} />
          <Route path="/profile/:id/*" element={<TabProfile />} />
          <Route path="/game/:id" element={<TabGame />} />
          <Route path="/join/*" element={<TabJoin />} />
          <Route path="/changelog" element={<TabChangelog />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  const { colorTokens } = useTheme();

  return (
    <PageWrapper column align>
      <Flex column align width="100vw">
        <Header />
        <Navigation />
        <Content colorTokens={colorTokens}>
          <SubHeader />
          <ErrorBoundary>{children}</ErrorBoundary>
        </Content>
      </Flex>
      <Footer />
    </PageWrapper>
  );
};

const ErrorBoundary = ({ children }: React.PropsWithChildren<unknown>) => (
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
