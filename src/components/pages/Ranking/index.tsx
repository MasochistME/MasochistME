import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import SearchBar from 'shared/components/SearchBar';
import { Flex, Wrapper, Spinner } from 'shared/components';
import { useTiers, useUsers } from 'shared/hooks';
import User from './User';

const WrapperRanking = styled.div`
	width: 100%;
`;
const RankingList = styled.ul`
	list-style-type: none;
	margin: 0;
	padding: 0;
	overflow: hidden;
	width: 100%;
`;

export default function PageRanking(): JSX.Element {
	const { tiersData } = useTiers();
	const searchUser = useSelector((state: any) => state.search.user);
	const ranking = useSelector((state: any) => state.ranking);
	const users = useUsers(true);

	const createRankingList = () => {
		if (!ranking?.length) return;
		return ranking?.map((user: any, position: number) => {
			const userName: any = users.find((u: any) => u.id === user.id)?.name;
			if (userName) {
				const isUserSearch =
					userName.toLowerCase().indexOf(searchUser.toLowerCase()) !== -1;
				return isUserSearch ? (
					<User id={user.id} position={position} key={`user-${user.id}`} />
				) : null;
			}
		});
	};

	return (
		<Flex column>
			<Wrapper type="description">
				<div className="page-description">
					<p>
						Ranking system utilizes the games&lsquo; score system. Depending on
						the game&lsquo;s individual difficulty level, it is given one of{' '}
						{tiersData?.length ?? 'X'} possible marks:
					</p>
					<ul>
						{tiersData
							?.sort((a: any, b: any) => a?.score - b?.score)
							.map((r: any, rIndex: number) => (
								<li key={`r-${rIndex}`}>
									<i className={r?.icon} /> - worth {r?.score} pts -{' '}
									{r?.description}{' '}
								</li>
							))}
					</ul>
					<p>
						Completing a game might mean earning its most demanding achievement,
						or getting the in-game 100%; but for the sake of simplicity the
						ranking system present here assumes that completing a game means
						earning 100% of its Steam achievements. You are awarded points
						depending on the completed game&lsquo;s difficulty level, which are
						later summarized and used to determine your placement on the ranking
						ladder.
					</p>
				</div>
				<SearchBar />
				{!ranking?.length && <Spinner />}
			</Wrapper>
			<WrapperRanking>
				<RankingList>{ranking?.length && createRankingList()}</RankingList>
			</WrapperRanking>
		</Flex>
	);
}
