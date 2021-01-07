import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Flex } from 'shared/components';
import {
  Info,
  Name,
  Icons,
  Avatar,
  Summary,
  Ranking,
  Position,
  PatronIcon,
  RatingScore,
} from './styles';

UserSummary.Name = Name;
UserSummary.Info = Info;
UserSummary.Icons = Icons;
UserSummary.Avatar = Avatar;
UserSummary.Summary = Summary;
UserSummary.Ranking = Ranking;
UserSummary.Position = Position;
UserSummary.PatronIcon = PatronIcon;
UserSummary.RatingScore = RatingScore;

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
        <UserSummary.RatingScore
          key={`member-rating-score-${scoreIndex}`}
          title={`Sum of all games completed in tier ${scoreId}.\nPoints total: ${tierPoints?.points}`}>
          {tierPoints?.total}
          <i className={score.icon} style={{ paddingRight: '5px' }} />
        </UserSummary.RatingScore>
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
    <UserSummary.Summary onClick={onShowProfile}>
      <UserSummary.Position>{position + 1}</UserSummary.Position>
      <UserSummary.Avatar src={user.avatar} alt="avatar" />
      <UserSummary.Icons>
        {patreonTier ? (
          <UserSummary.PatronIcon
            tier={patreonTier}
            className="fas fa-donate"
            // title={patron.description.toUpperCase()}
          />
        ) : (
          <UserSummary.PatronIcon
            className="fas fa-donate"
            style={{ color: 'transparent' }}
          />
        )}
        {user.updated < 1585080000000 ? (
          <i
            className="fas fa-exclamation-circle"
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
      </UserSummary.Icons>
      <UserSummary.Info>
        <i
          className={`fas fa-chevron-down icon-hover ${
            detailsVisible ? 'icon-active' : ''
          }`}
          onClick={onShowDetailsClick}
        />
        <Flex row>
          {disabled ? (
            <i
              className="fas fa-exclamation-triangle"
              title="This user has their Steam profile set to private."
            />
          ) : (
            <div></div>
          )}
          <UserSummary.Name tier={patreonTier} shekelmaster={shekelmaster}>
            {user.name}
          </UserSummary.Name>
        </Flex>
        <div className="dummy"></div>
        <UserSummary.Ranking>
          <UserSummary.RatingScore title="Sum of all points">
            {user.points.sum ? user.points.sum : 0}
            <span className="bold"> Σ</span>
          </UserSummary.RatingScore>
          {gameTierPoints()}
          <UserSummary.RatingScore
            title={`Sum of all badges earned.\nPoints total: ${badges.points}`}>
            {badges.total}
            <i className="fas fa-medal" style={{ paddingRight: '5px' }} />
          </UserSummary.RatingScore>
        </UserSummary.Ranking>
      </UserSummary.Info>
    </UserSummary.Summary>
  );
}
