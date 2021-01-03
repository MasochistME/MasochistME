import React from 'react';
import _ from 'lodash';
import MemberGame from '../MemberGame';

type TMemberDetails = {
  member: any;
  show: any;
  rating: any;
  badges: any;
  games: any;
};

export default function MemberDetails(props: TMemberDetails): JSX.Element {
  const { member, show, rating, badges, games } = props;

  const summarizeBadgePoints = (member: any, badges: any) => {
    let sum = 0;
    member.badges.map((badge: any) => {
      const membersBadge = badges.find((b: any) => badge.id == b['_id']);
      if (membersBadge) {
        if (typeof membersBadge.points !== 'number') {
          membersBadge.points = parseInt(membersBadge.points);
        }
        sum += membersBadge.points;
      }
    });
    return sum;
  };

  const classDisplay = show
    ? 'member-details flex-column member-details-visible'
    : 'member-details flex-column member-details-hidden';

  const composeGameList = () => {
    member.games = member.games.map((game: any) => {
      game.completionRate = isNaN(game.completionRate)
        ? 0
        : game.completionRate;
      return game;
    });
    const memberGames = _.orderBy(
      member.games,
      ['completionRate', 'lastUnlocked'],
      ['desc', 'desc'],
    );
    return memberGames.map(game => {
      let gameDetails = games.find(g => Number(g.id) === Number(game.appid));
      if (!gameDetails) {
        gameDetails = {
          title: 'unknown',
          rating: 'unknown',
          img: 'unknown',
          playtime_forever: 0,
        };
      }
      const ratingIcon = rating.find((r: any) => r.id === gameDetails.rating);
      return (
        <MemberGame
          key={`game-${game.appid}`}
          game={{
            ...game,
            title: gameDetails.title,
            rating: ratingIcon ? ratingIcon.icon : 'fas fa-spinner',
            img: gameDetails.img,
          }}
        />
      );
    });
  };

  return (
    <div className={classDisplay}>
      <div className="flex-row member-details-summary">
        <div className="member-rating-score" title="Sum of all points">
          {member.points ? member.points : 0}
          <span className="bold"> Σ</span>
        </div>
        {rating.map((score: any, scoreIndex: number) => {
          return (
            <div
              className="member-rating-score"
              key={`member-rating-score-${scoreIndex}`}>
              {member.ranking[score.id] !== undefined
                ? member.ranking[score.id]
                : 0}
              <i className={score.icon} style={{ paddingRight: '5px' }} />
            </div>
          );
        })}
        <div className="member-rating-score" title="Sum of points for badges">
          {summarizeBadgePoints(member, badges)}
          <i className="fas fa-medal" style={{ paddingRight: '5px' }} />
        </div>
      </div>
      {composeGameList()}
    </div>
  );
}
