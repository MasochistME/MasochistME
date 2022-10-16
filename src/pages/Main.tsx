import React from 'react';
import styled from 'styled-components';

import { media, colors } from 'shared/theme';
import { Wrapper } from 'components';
import { MiniHeader, Header, Nav, Sidebar } from 'containers';

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

type Props = {
	children: React.ReactNode;
};

export const Main = (props: Props): JSX.Element => {
	const { children } = props;

	return (
		<Wrapper type="main">
			<Header />
			<Wrapper type="nav">
				<Nav />
			</Wrapper>
			<Wrapper type="middle">
				<WrapperContent>
					<MiniHeader />
					<WrapperPage>{children}</WrapperPage>
				</WrapperContent>
				<Sidebar />
			</Wrapper>
			<Wrapper type="footer" />
		</Wrapper>
	);
};

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
