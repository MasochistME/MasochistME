// import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import styled from 'styled-components';

// import { media, colors } from 'shared/theme';
// import { changeTab } from 'shared/store/modules/Tabs';
// import { MiniHeader, Wrapper, Header, Nav } from 'components';
// import SidebarWrapper from 'components/sidebar/SidebarWrapper';

// import { TabBadges } from './TabBadges';
// import { TabEvents } from './TabEvents';
// import { TabGame } from './TabGame';
// import { TabGames } from './TabGames';
// import { TabHome } from './TabHome';
// import { TabLeaderboards } from './TabLeaderboards';
// import { TabProfile } from './TabProfile';
// import { TabSupport } from './TabSupport';
// import { NotFound } from './NotFound';

// type TPage =
// 	| 'home'
// 	| 'games'
// 	| 'ranking'
// 	| 'events'
// 	| 'support'
// 	| 'profile'
// 	| 'game'
// 	| 'badges'
// 	| 'admin'
// 	| 'notfound';
// type TSubPage = 'badges' | 'users' | 'games' | undefined;
// type Props = {
// 	page: TPage;
// 	subpage?: TSubPage;
// };

// export default function Page(props: Props): JSX.Element {
// 	const { page } = props;
// 	const dispatch = useDispatch();

// 	const selectTab = () => {
// 		switch (page) {
// 			case 'home':
// 				return <TabHome />;
// 			case 'games':
// 				return <TabGames />;
// 			case 'ranking':
// 				return <TabLeaderboards />;
// 			case 'events':
// 				return <TabEvents />;
// 			case 'support':
// 				return <TabSupport />;
// 			case 'profile':
// 				return <TabProfile />;
// 			case 'game':
// 				return <TabGame />;
// 			case 'badges':
// 				return <TabBadges />;
// 			case 'notfound':
// 				return <NotFound />;
// 			default:
// 				return <TabHome />;
// 		}
// 	};

// 	useEffect(() => {
// 		dispatch(changeTab(page));
// 	}, [page]);

// 	return (
// 		<Wrapper type="main">
// 			<Header />
// 			<Wrapper type="nav">
// 				<Nav />
// 			</Wrapper>
// 			<Wrapper type="middle">
// 				<WrapperContent>
// 					<MiniHeader />
// 					<WrapperPage>{selectTab()}</WrapperPage>
// 				</WrapperContent>
// 				<SidebarWrapper />
// 			</Wrapper>
// 			<Wrapper type="footer" />
// 		</Wrapper>
// 	);
// }

// const WrapperContent = styled.div`
// 	position: relative;
// 	width: 70%;
// 	height: auto;
// 	box-sizing: border-box;
// 	color: ${colors.superLightGrey};
// 	@media (max-width: ${media.netbooks}) {
// 		width: 100%;
// 	}
// `;

// const WrapperPage = styled.div`
// 	margin: 30px 30px 0 0;
// `;

export {};
