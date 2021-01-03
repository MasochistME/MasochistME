import React from 'react';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import { SmallMember, Section, SectionTitle } from '../../';

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function SectionTop(): JSX.Element {
  const members = useSelector((state: any) =>
    orderBy(
      state.members,
      [member => (member.points ? member.points : 0)],
      ['desc'],
    ).slice(0, 10),
  );

  const memberRow = (member: any, index: number) => (
    <SmallMember key={`sidebar-member-${index}`}>
      <div>{index + 1}.</div>
      <div>
        <span className="bold">{member.name}</span>
      </div>
      <div>{member.points} pts</div>
    </SmallMember>
  );

  return (
    <Section>
      <SectionTitle>Top 10 members</SectionTitle>
      <FlexColumn>
        {members.map((member, memberIndex) => memberRow(member, memberIndex))}
      </FlexColumn>
    </Section>
  );
}
