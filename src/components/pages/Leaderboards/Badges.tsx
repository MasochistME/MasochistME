import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Flex, Section } from 'shared/components';
import { Description, Field, BadgeImg } from './styles';

const StyledBadges = styled.div`
  min-width: 400px;
`;

Badges.Img = BadgeImg;
Badges.Field = Field;
Badges.Section = Section;
Badges.Description = Description;

export default function Badges(props: {
  game: any;
  mini?: boolean;
}): JSX.Element {
  const { game, mini } = props;
  const badges = useSelector((state: any) =>
    state.badges.filter((badge: any) => game.badges.includes(badge['_id'])),
  );

  return mini ? (
    <StyledBadges>
      <Badges.Section>
        <h3>Badges</h3>
        <Flex row style={{ margin: '8px' }}>
          {badges.map((badge: any, index: number) => (
            <Badges.Img
              style={{ margin: '5px 10px 5px 5px' }}
              src={badge.img}
              alt="badge"
              key={`badge-${index}`}
              title={`${badge.points} pts - ${badge.name}\n"${badge.description}"`}
            />
          ))}
        </Flex>
      </Badges.Section>
    </StyledBadges>
  ) : (
    <StyledBadges>
      <Badges.Section>
        <h3>Badges</h3>
        <Flex
          column
          style={{
            width: '100%',
            height: '100%',
            padding: '0 10px 10px 10px',
            boxSizing: 'border-box',
          }}>
          {badges.map((badge: any, index: number) => (
            <Badges.Description key={`badge-${index}`}>
              <h4 style={{ margin: 0, textAlign: 'center' }}>
                {badge.name?.toUpperCase()}
              </h4>
              <Flex row style={{ width: '100%' }}>
                <Badges.Img
                  style={{ margin: '5px 10px 5px 5px' }}
                  src={badge.img}
                  alt="badge"
                  key={`badge-${index}`}
                />
                <Flex column style={{ width: '100%' }}>
                  <Badges.Field>Points: {badge.points} pts</Badges.Field>
                  <Badges.Field>Proof: {badge.requirements}</Badges.Field>
                  <Badges.Field>Description: {badge.description}</Badges.Field>
                </Flex>
              </Flex>
            </Badges.Description>
          ))}
        </Flex>
      </Badges.Section>
    </StyledBadges>
  );
}
