import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { media, colors } from 'shared/theme';
import { changeTab } from 'shared/store/modules/Tabs';
import { MiniHeader, Wrapper, Header, Nav } from 'shared/components';
import SidebarWrapper from 'components/sidebar/SidebarWrapper';
import PageHome from './Home';
import PageNotFound from './NotFound';
import PageAllGames from './AllGames';
import PageRanking from './Ranking';
import PageEvents from './Events';
import PageSupport from './Support';
import PageBadges from './Badges';
import PageProfile from './Profile';
import PageGame from './Game';
import PageAdmin from './Admin';

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
  | 'admin'
  | 'notfound';
type TSubPage = 'badges' | 'users' | 'games' | undefined;
type Props = {
  page: TPage;
  subpage?: TSubPage;
};

export default function Page(props: Props): JSX.Element {
  const { page, subpage = undefined } = props;
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
      case 'admin':
        return <PageAdmin page={subpage} />;
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
