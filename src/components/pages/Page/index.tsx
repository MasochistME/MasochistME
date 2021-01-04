import React from 'react';
import { useSelector } from 'react-redux';
import PageHome from '../Home';
import PageGames from '../Games';
import PageRanking from '../Ranking';
import PageEvents from '../Events';
import PageSupport from '../Support';
import PageBadges from '../Badges';
import PageProfile from '../Profile';

const assignPageType = (tab: any) => {
  switch (tab) {
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

export default function Page(): JSX.Element {
  const activeTab = useSelector((state: any) => state.activeTab);
  return <div className="wrapper-page">{assignPageType(activeTab)}</div>;
}
