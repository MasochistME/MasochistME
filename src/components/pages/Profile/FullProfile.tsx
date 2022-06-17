/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { orderBy } from 'lodash';

import { changeTab } from 'shared/store/modules/Tabs';
import { AppContext } from 'shared/store/context';
import { Flex, Wrapper, Section, BigBadge } from 'shared/components';
import { Badges } from './styles';
import ProfileGraphs from './ProfileGraphs';

FullProfile.Badges = Badges;
FullProfile.Badge = BigBadge;
FullProfile.Section = Section;

type Props = {
  user: any;
};
export default function FullProfile(props: Props): JSX.Element {
  const { user } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoggedIn, userId } = useContext(AppContext);
  const { id } = useParams<{ id: string }>();
  const canEdit = isLoggedIn && userId === id;

  const games = useSelector((state: any) => state.games.list);

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
    if (canEdit) {
      dispatch(changeTab('me'));
    } else {
      dispatch(changeTab('profile'));
    }
  }, [id]);

  return (
    <Flex column>
      <Wrapper type="page">
        {badges?.length ? (
          <FullProfile.Badges>
            <FullProfile.Section style={{ width: '100%' }}>
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
                    <FullProfile.Badge
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
            </FullProfile.Section>
          </FullProfile.Badges>
        ) : null}
        {!isNaN(user?.points?.sum) && user?.points?.sum !== 0 ? (
          <ProfileGraphs user={user} />
        ) : null}
      </Wrapper>
    </Flex>
  );
}
