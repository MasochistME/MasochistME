/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { orderBy } from 'lodash';
import { showProfile } from 'shared/store/modules/Profiles';
import { changeTab } from 'shared/store/modules/Tabs';
import { Flex, Wrapper, Spinner, Section } from 'shared/components';
import { Badges, Badge } from './styles';
import { useUserDetails } from 'components/init';
import ProfileGraphs from './ProfileGraphs';
import ProfileHeader from './ProfileHeader';

Profile.Badges = Badges;
Profile.Badge = Badge;
Profile.Section = Section;

export default function Profile(): JSX.Element {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const userLoaded = useUserDetails(id);

  const games = useSelector((state: any) => state.games.list);
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

  const badges = useSelector((state: any) => {
    const userBadges = state.badges
      .filter(
        (badge: any) =>
          user?.badges && user.badges.find((b: any) => b.id === badge._id),
      )
      .map(
        (badge: any) =>
          (badge = {
            ...badge,
            points:
              typeof badge.points !== 'number'
                ? Number(badge.points)
                : badge.points,
            game: badge.isNonSteamGame
              ? badge.game
              : games.find((game: any) => game.id === badge.gameId)
              ? games.find((game: any) => game.id === badge.gameId).title
              : 'unknown',
          }),
      );
    const orderedUserBadges = orderBy(
      userBadges,
      [badge => badge.points],
      ['desc'],
    );
    return orderedUserBadges;
  });

  const onBadgeClick = (id?: string) => id && history.push(`/game/${id}`);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(showProfile(id));
    dispatch(changeTab('profile'));
  }, []);

  return (
    <Flex column>
      <ProfileHeader user={userBasic} />
      {user && !user.private ? (
        <>
          <Wrapper type="page">
            {badges?.length ? (
              <Profile.Badges>
                <Profile.Section style={{ width: '100%' }}>
                  <h3>Badges</h3>
                  <Flex
                    justify
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexFlow: 'row wrap',
                    }}>
                    {badges.map((badge, index) => {
                      const game = games.find(
                        (g: any) => Number(g.id) === Number(badge.gameId),
                      );
                      return (
                        <Badge
                          src={badge.img}
                          alt="badge"
                          title={`${
                            badge?.game !== 'unknown'
                              ? badge?.game.toUpperCase()
                              : game?.title.toUpperCase()
                          } - ${badge.name} (${badge.points} pts)\n"${
                            badge.description
                          }"`}
                          key={`badge-${index}`}
                          onClick={() => onBadgeClick(game?.id)}
                        />
                      );
                    })}
                  </Flex>
                </Profile.Section>
              </Profile.Badges>
            ) : null}
            {!isNaN(user?.points?.sum) && user?.points?.sum !== 0 ? (
              <ProfileGraphs user={user} />
            ) : null}
          </Wrapper>
        </>
      ) : (
        <Wrapper type="description">
          {user?.private ? (
            <p>
              This user has their profile set to{' '}
              <span className="bold">private</span>.
            </p>
          ) : (
            <Spinner />
          )}
        </Wrapper>
      )}
    </Flex>
  );
}
