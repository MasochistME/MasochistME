import React from 'react';
import _ from 'lodash';
import MemberGame from '../MemberGame';

export default class MemberDetails extends React.Component {
  summarizeBadgePoints = (member, badges) => {
    let sum = 0;
    member.badges.map(badge => {
      const membersBadge = badges.find(b => badge.id == b['_id']);
      if (membersBadge) {
        if (typeof membersBadge.points !== 'number') {
          membersBadge.points = parseInt(membersBadge.points);
        }
        sum += membersBadge.points;
      }
    });
    return sum;
  };

  render() {
    const { member, show, rating, badges, games } = this.props;
    const classDisplay = show
      ? 'member-details flex-column member-details-visible'
      : 'member-details flex-column member-details-hidden';

    const composeGameList = () => {
      member.games = member.games.map(game => {
        game.completionRate = isNaN(game.completionRate)
          ? 0
          : game.completionRate;
        return game;
      });
      let memberGames = _.orderBy(
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
        let ratingIcon = rating.find(r => r.id === gameDetails.rating);
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
          {rating.map((score, scoreIndex) => {
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
            {this.summarizeBadgePoints(member, badges)}
            <i className="fas fa-medal" style={{ paddingRight: '5px' }} />
          </div>
        </div>
        {composeGameList()}
      </div>
    );
  }
}
