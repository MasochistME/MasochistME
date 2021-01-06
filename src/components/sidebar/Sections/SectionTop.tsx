import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { SmallMember, Section, SectionTitle } from '../';
import Spinner from 'shared/components/Spinner';

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function SectionTop(): JSX.Element {
  const users = useSelector((state: any) => {
    const usersRating = state.ranking.slice(0, 10);
    const usersBasic = state.users;
    const usersFull = usersRating.map((user: any) => ({
      ...user,
      name: usersBasic.find((u: any) => u.id === user.id)?.name,
    }));
    return usersFull;
  });

  const userRow = (user: any, index: number) => (
    <SmallMember key={`sidebar-user-${index}`}>
      <div>{index + 1}.</div>
      <div>
        <span className="bold">{user.name}</span>
      </div>
      <div>{user.points.sum} pts</div>
    </SmallMember>
  );

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
