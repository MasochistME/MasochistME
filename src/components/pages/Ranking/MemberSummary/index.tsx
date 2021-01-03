import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { changeTab } from '../../../../shared/store/modules/Tabs';
import { showProfile } from '../../../../shared/store/modules/Profiles';

type TMemberSummary = {
  index: number;
  member: any;
  rating: any;
  patron: any;
  badges: any;
  onShowDetails: () => any;
};

export default function MemberSummary(props: TMemberSummary): JSX.Element {
  const dispatch = useDispatch();
  const { member, index, rating, patron, badges, onShowDetails } = props;
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [memberId, setMemberId] = useState(0);

  const tier = patron ? patron.tier : null;
  const shekelmaster = Number(tier) === 4;

  const summarizeBadgePoints = (member: any, badges: any): number => {
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

  const badgePoints = summarizeBadgePoints(member, badges);
  const disabled = member.points - badgePoints <= 0 ? true : false;

  const onShowDetailsClick = (event: any): void => {
    setDetailsVisible(!detailsVisible);
    onShowDetails();
    event.stopPropagation();
  };

  const onShowProfile = () => {
    dispatch(showProfile(member));
    dispatch(changeTab('profile'));
  };

  useEffect(() => {
    setMemberId(member.id);
  }, []);

  return (
    <div
      className={`member-summary flex-row ${
        disabled ? 'member-disabled' : ''
      } ${shekelmaster ? 'member-shekelmaster' : ''}`}
      onClick={onShowProfile}>
      <div className="member-position">{index + 1}</div>
      <img className="member-avatar" src={member.avatar} alt="avatar" />
      <div
        className="member-icons"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'spaceBetween',
          alignItems: 'center',
        }}>
        {tier ? (
          <i
            className={`fas fa-donate member-patron tier${tier}`}
            title={patron.description.toUpperCase()}
          />
        ) : (
          <i
            className="fas fa-donate member-patron"
            style={{ color: 'transparent' }}
          />
        )}
        {member.updated < 1585080000000 ? (
          <i
            className={'fas fa-exclamation-circle'}
            title="This member wasn't updated after the game tier rework. Their info might be outdated."
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
      <div className="member-info flex-row">
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
              title="This member has their Steam profile set to private."
            />
          ) : (
            <div></div>
          )}
          <div className={`member-name ${shekelmaster ? `tier${tier}` : ''}`}>
            {member.name}
          </div>
        </div>
        <div className="dummy"></div>
        <div className="member-ranking flex-row">
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
            {badgePoints}
            <i className="fas fa-medal" style={{ paddingRight: '5px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
