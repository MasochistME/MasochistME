/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import { colors, fonts } from 'shared/theme';
import { showProfile } from 'shared/store/modules/Profiles';
import { changeTab } from 'shared/store/modules/Tabs';
import { Flex, Wrapper, Spinner } from 'shared/components';
import { useUserDetails } from 'components/init';
import ProfileGraphs from './ProfileGraphs';
import ProfileHeader from './ProfileHeader';

const WrapperProfile = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: ${colors.darkBlueTransparent};
`;
const Badges = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;
const Badge = styled.img`
  border-radius: 10px;
  border: 3px solid ${colors.superLightGrey};
  box-sizing: border-box;
  width: 64px;
  height: 64px;
  min-width: 64px;
  min-height: 64px;
  cursor: help;
  box-shadow: 0 0 5px ${colors.superDarkGrey};
  margin: 10px;
`;
const Section = styled.div`
  padding: 0;
  margin: 0 10px 10px 10px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 0 20px ${colors.superDarkGrey};
  background-color: rgba(${colors.superLightGrey}, 0.1);
  canvas {
    margin: 10px 0 10px 0;
  }
  h3 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 5px 0 5px;
    margin: 0;
    font-size: 1.3em;
    text-transform: uppercase;
    font-family: ${fonts.Dosis};
    text-transform: uppercase;
    background-color: rgba(${colors.newDark}, 0.8);
    color: ${colors.superLightGrey};
    p {
      margin: 0;
    }
  }
`;

Profile.Badges = Badges;
Profile.Badge = Badge;
Profile.Section = Section;

export default function Profile(): JSX.Element {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const userLoaded = useUserDetails(id);

  const games = useSelector((state: any) => state.games);
  const userBasic = useSelector((state: any) =>
    state.users.list.find((user: any) => user.id === id),
  );
  const user = useSelector((state: any) => {
    if (userLoaded) {
      const userDetails = state.users.details.find(
        (user: any) => user.id === id,
      );
      const userRanking = state.ranking.find((user: any) => user.id === id)
        ?.points;
      return {
        ...userBasic,
        ...userDetails,
        points: userRanking,
      };
    }
  });

  const badges = useSelector((state: any) =>
    orderBy(
      state.badges
        .filter(
          (badge: any) =>
            user?.badges && user.badges.find((b: any) => b.id === badge._id),
        )
        .map(
          (badge: any) =>
            (badge = {
              ...badge,
              game: badge.isNonSteamGame
                ? badge.game
                : games.find((game: any) => game.id === badge.gameId)
                ? games.find((game: any) => game.id === badge.gameId).title
                : 'unknown',
            }),
        ),
      ['points'],
      ['desc'],
    ),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(showProfile(id));
    dispatch(changeTab('profile'));
  }, []);

  return (
    <Flex column>
      <ProfileHeader user={userBasic} />
      {user ? (
        <>
          <WrapperProfile>
            {badges?.length ? (
              <Profile.Badges>
                <Profile.Section>
                  <h3>Badges</h3>
                  <Flex
                    justify
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexFlow: 'row wrap',
                    }}>
                    {badges.map((badge, index) => (
                      <Badge
                        src={badge.img}
                        alt="badge"
                        title={`${badge.game.toUpperCase()} - ${badge.name} (${
                          badge.points
                        } pts)\n"${badge.description}"`}
                        key={`badge-${index}`}
                      />
                    ))}
                  </Flex>
                </Profile.Section>
              </Profile.Badges>
            ) : null}
            {!isNaN(user?.points?.sum) && user?.points?.sum !== 0 ? (
              <ProfileGraphs user={user} />
            ) : null}
          </WrapperProfile>
        </>
      ) : (
        <Wrapper type="description">
          <Spinner />
        </Wrapper>
      )}
    </Flex>
  );
}
