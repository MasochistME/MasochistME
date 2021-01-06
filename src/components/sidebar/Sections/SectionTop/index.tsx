import React from 'react';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import { SmallMember, Section, SectionTitle } from '../../';
import Spinner from 'shared/components/Spinner';

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function SectionTop(): JSX.Element {
  const users = useSelector((state: any) =>
    orderBy(
      state.users,
      [user => (user.points ? user.points : 0)],
      ['desc'],
    ).slice(0, 10),
  );

  const userRow = (user: any, index: number) => (
    <SmallMember key={`sidebar-user-${index}`}>
      <div>{index + 1}.</div>
      <div>
        <span className="bold">{user.name}</span>
      </div>
      <div>{user.points} pts</div>
    </SmallMember>
  );

  return (
    <Section>
      <SectionTitle>Top 10 users</SectionTitle>
      <FlexColumn>
        {users.length ? (
          users.map((user, userIndex) => userRow(user, userIndex))
        ) : (
          <Spinner />
        )}
      </FlexColumn>
    </Section>
  );
}
