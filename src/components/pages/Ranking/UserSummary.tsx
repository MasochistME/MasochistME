import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

type TUserSummary = {
  id: any;
  position: number;
  onShowDetails: () => any;
};

export default function UserSummary(props: TUserSummary): JSX.Element {
  const history = useHistory();
  const { id, position, onShowDetails } = props;
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [userId, setUserId] = useState(0);

  const rating = useSelector((state: any) => state.rating);
  const user = useSelector((state: any) => {
    const userRank = state.ranking.find((u: any) => u.id === id);
    const userDetails = state.users.list.find((u: any) => u.id === id);
    return {
      ...userRank,
      name: userDetails.name,
      avatar: userDetails.avatar,
    };
  });
  const badges = user.points.badges;
  const patreonTier = user.patreon.tier;
  const shekelmaster = Number(patreonTier) === 4;

  const disabled = user.points.sum - user.points.badges <= 0 ? true : false;

  const gameTierPoints = () => {
    return rating.map((score: any, scoreIndex: number) => {
      const scoreId =
        typeof score.id !== 'number' ? Number(score.id) : score.id;
      const tierPoints = user.points.list.find(
        (gameTier: any) => gameTier.tier === scoreId,
      );
      return (
        <div
          className="member-rating-score"
          key={`member-rating-score-${scoreIndex}`}
          title={`Sum of all games completed in tier ${scoreId}.\nPoints total: ${tierPoints?.points}`}>
          {tierPoints?.total}
          <i className={score.icon} style={{ paddingRight: '5px' }} />
        </div>
      );
    });
  };

  const onShowDetailsClick = (event: any): void => {
    setDetailsVisible(!detailsVisible);
    onShowDetails();
    event.stopPropagation();
  };

  const onShowProfile = () => {
    history.push(`/profile/${userId}`);
  };

  useEffect(() => {
    setUserId(user.id);
  }, []);

  return (
    <div
      className={`member-summary flex-row ${
        disabled ? 'member-disabled' : ''
      } ${shekelmaster ? 'member-shekelmaster' : ''}`}
      onClick={onShowProfile}>
      <div className="member-position">{position + 1}</div>
      <img className="member-avatar" src={user.avatar} alt="avatar" />
      <div
        className="member-icons"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'spaceBetween',
          alignItems: 'center',
        }}>
        {patreonTier ? (
          <i
            className={`fas fa-donate member-patron tier${patreonTier}`}
            // title={patron.description.toUpperCase()}
            title={'dupa'}
          />
        ) : (
          <i
            className="fas fa-donate member-patron"
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
              title="This user has their Steam profile set to private."
            />
          ) : (
            <div></div>
          )}
          <div
            className={`member-name ${
              shekelmaster ? `tier${patreonTier}` : ''
            }`}>
            {user.name}
          </div>
        </div>
        <div className="dummy"></div>
        <div className="member-ranking flex-row">
          <div className="member-rating-score" title="Sum of all points">
            {user.points.sum ? user.points.sum : 0}
            <span className="bold"> Σ</span>
          </div>
          {gameTierPoints()}
          <div
            className="member-rating-score"
            title={`Sum of all badges earned.\nPoints total: ${badges.points}`}>
            {badges.total}
            <i className="fas fa-medal" style={{ paddingRight: '5px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
