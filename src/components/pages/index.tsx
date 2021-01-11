import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { media, colors } from 'shared/theme';
import { changeTab } from 'shared/store/modules/Tabs';
import { Flex, MiniHeader, Wrapper, Header, Nav } from 'shared/components';
import SidebarWrapper from 'components/sidebar/SidebarWrapper';
import PageHome from './Home';
import PageAllGames from './AllGames';
import PageRanking from './Ranking';
import PageEvents from './Events';
import PageSupport from './Support';
import PageBadges from './Badges';
import PageProfile from './Profile';
import PageGame from './Game';

const WrapperContent = styled.div`
  position: relative;
  width: 70%;
  height: auto;
  box-sizing: border-box;
  color: ${colors.superLightGrey};
  @media (max-width: ${media.netbooks}) {
    width: 100%;
  }
`;

const WrapperPage = styled.div`
  margin: 30px 30px 0 0;
`;

type TPage =
  | 'home'
  | 'games'
  | 'ranking'
  | 'events'
  | 'support'
  | 'profile'
  | 'game'
  | 'badges'
  | 'notfound';
type Props = {
  page: TPage;
};

export default function Page(props: Props): JSX.Element {
  const { page } = props;
  const dispatch = useDispatch();
  const selectPage = () => {
    switch (page) {
      case 'home':
        return <PageHome />;
      case 'games':
        return <PageAllGames />;
      case 'ranking':
        return <PageRanking />;
      case 'events':
        return <PageEvents />;
      case 'support':
        return <PageSupport />;
      case 'profile':
        return <PageProfile />;
      case 'game':
        return <PageGame />;
      case 'badges':
        return <PageBadges />;
      case 'notfound':
        return <PageNotFound />;
      default:
        return <PageHome />;
    }
  };

  useEffect(() => {
    dispatch(changeTab(page));
  }, [page]);

  return (
    <Wrapper type="main">
      {/* <LoginModal /> */}
      <Header />
      <Wrapper type="nav">
        <Nav />
      </Wrapper>
      <Wrapper type="middle">
        <WrapperContent>
          <MiniHeader />
          <WrapperPage>{selectPage()}</WrapperPage>
        </WrapperContent>
        <SidebarWrapper />
      </Wrapper>
      <Wrapper type="footer" />
    </Wrapper>
  );
}

function PageNotFound() {
  return (
    <Flex column>
      <Wrapper type="description">
        <div
          className="page-description"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <img src="https://http.cat/404" alt="404" />
        </div>
      </Wrapper>
    </Flex>
  );
}
