import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { SmallMember, MemberLink, Section, SectionTitle } from '../';
import Spinner from 'shared/components/Spinner';

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function SectionTop(): JSX.Element {
  const history = useHistory();
  const users = useSelector((state: any) => {
    const usersRating = state.ranking.slice(0, 10);
    const usersBasic = state.users.list;
    const usersFull = usersRating.map((user: any) => ({
      ...user,
      name: usersBasic.find((u: any) => u.id === user.id)?.name,
    }));
    return usersFull;
  });

  const userRow = (user: any, index: number) => {
    const onUserClick = () => history.push(`/profile/${user.id}`);
    return (
      <SmallMember key={`sidebar-user-${index}`}>
        <div>{index + 1}.</div>
        <MemberLink onClick={onUserClick}>
          <span className="bold">{user.name}</span>
        </MemberLink>
        <div>{user.points.sum} pts</div>
      </SmallMember>
    );
  };

  return (
    <Section>
      <SectionTitle>Top 10 users</SectionTitle>
      <FlexColumn>
        {users.length ? (
          users.map((user: any, userIndex: number) => userRow(user, userIndex))
        ) : (
          <Spinner />
        )}
      </FlexColumn>
    </Section>
  );
}
