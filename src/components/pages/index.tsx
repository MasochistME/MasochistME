import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { media, colors } from 'shared/theme';
import { changeTab } from 'shared/store/modules/Tabs';
import MiniHeader from 'shared/components/MiniHeader';
import Wrapper from 'shared/components/layout/Wrapper';
import Header from 'shared/components/Header';
import Nav from 'shared/components/Nav';
import SidebarWrapper from 'components/sidebar/SidebarWrapper';
import PageHome from './Home';
import PageGames from './Games';
import PageRanking from './Ranking';
import PageEvents from './Events';
import PageSupport from './Support';
import PageBadges from './Badges';
import PageProfile from './Profile';

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
  | 'badges';
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
        return <PageGames />;
      case 'ranking':
        return <PageRanking />;
      case 'events':
        return <PageEvents />;
      case 'support':
        return <PageSupport />;
      case 'profile':
        return <PageProfile />;
      case 'badges':
        return <PageBadges />;
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
