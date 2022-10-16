import React from 'react';
import styled from 'styled-components';

import { media, colors } from 'shared/theme';
import { Wrapper } from 'components';
import { MiniHeader, Header, Nav, Sidebar } from 'containers';

type Props = {
	tab: React.ReactNode;
};

export const Main = (props: Props): JSX.Element => {
	const { tab } = props;

	return (
		<Wrapper type="main">
			<Header />
			<Wrapper type="nav">
				<Nav />
			</Wrapper>
			<Wrapper type="middle">
				<Content>
					<MiniHeader />
					<SubPage>{tab}</SubPage>
				</Content>
				<Sidebar />
			</Wrapper>
			<Wrapper type="footer" />
		</Wrapper>
	);
};

const Content = styled.div`
	position: relative;
	width: 70%;
	height: auto;
	box-sizing: border-box;
	color: ${colors.superLightGrey};
	@media (max-width: ${media.netbooks}) {
		width: 100%;
	}
`;

const SubPage = styled.div`
	margin: 30px 30px 0 0;
`;
