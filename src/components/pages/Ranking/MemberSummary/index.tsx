import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

type TMemberSummary = {
  index: number;
  user: any;
  rating: any;
  patron: any;
  badges: any;
  onShowDetails: () => any;
};

export default function MemberSummary(props: TMemberSummary): JSX.Element {
  const history = useHistory();
  const { user, index, rating, patron, badges, onShowDetails } = props;
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [userId, setMemberId] = useState(0);

  const tier = patron ? patron.tier : null;
  const shekelmaster = Number(tier) === 4;

  const summarizeBadgePoints = (user: any, badges: any): number => {
    let sum = 0;
    user.badges.map((badge: any) => {
      const usersBadge = badges.find((b: any) => badge.id === b['_id']); // TODO equality
      if (usersBadge) {
        if (typeof usersBadge.points !== 'number') {
          usersBadge.points = parseInt(usersBadge.points);
        }
        sum += usersBadge.points;
      }
    });
    return sum;
  };

  const badgePoints = summarizeBadgePoints(user, badges);
  const disabled = user.points - badgePoints <= 0 ? true : false;

  const onShowDetailsClick = (event: any): void => {
    setDetailsVisible(!detailsVisible);
    onShowDetails();
    event.stopPropagation();
  };

  const onShowProfile = () => {
    history.push(`/profile/${userId}`);
  };

  useEffect(() => {
    setMemberId(user.id);
  }, []);

  return (
    <div
      className={`user-summary flex-row ${
        disabled ? 'user-disabled' : ''
      } ${shekelmaster ? 'user-shekelmaster' : ''}`}
      onClick={onShowProfile}>
      <div className="user-position">{index + 1}</div>
      <img className="user-avatar" src={user.avatar} alt="avatar" />
      <div
        className="user-icons"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'spaceBetween',
          alignItems: 'center',
        }}>
        {tier ? (
          <i
            className={`fas fa-donate user-patron tier${tier}`}
            title={patron.description.toUpperCase()}
          />
        ) : (
          <i
            className="fas fa-donate user-patron"
            style={{ color: 'transparent' }}
          />
        )}
        {user.updated < 1585080000000 ? (
          <i
            className={'fas fa-exclamation-circle'}
            title="This user wasn't updated after the game tier rework. Their info might be outdated."
            style={{
              color: 'pink',
              marginLeft: '10px',
              cursor: 'help',
              opacity: '0.3',
            }}
          />
        ) : (
          <i
            className="fas fa-exclamation-circle"
            style={{ color: 'transparent', marginLeft: '10px' }}
          />
        )}
      </div>
      <div className="user-info flex-row">
        <i
          className={`fas fa-chevron-down icon-hover ${
            detailsVisible ? 'icon-active' : ''
          }`}
          onClick={onShowDetailsClick}
        />
        <div className="flex-row">
          {disabled ? (
            <i
              className="fas fa-exclamation-triangle"
              title="This user has their Steam profile set to private."
            />
          ) : (
            <div></div>
          )}
          <div className={`user-name ${shekelmaster ? `tier${tier}` : ''}`}>
            {user.name}
          </div>
        </div>
        <div className="dummy"></div>
        <div className="user-ranking flex-row">
          <div className="user-rating-score" title="Sum of all points">
            {user.points ? user.points : 0}
            <span className="bold"> Σ</span>
          </div>
          {rating.map((score: any, scoreIndex: number) => {
            return (
              <div
                className="user-rating-score"
                key={`user-rating-score-${scoreIndex}`}>
                {user.ranking[score.id] !== undefined
                  ? user.ranking[score.id]
                  : 0}
                <i className={score.icon} style={{ paddingRight: '5px' }} />
              </div>
            );
          })}
          <div className="user-rating-score" title="Sum of points for badges">
            {badgePoints}
            <i className="fas fa-medal" style={{ paddingRight: '5px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
