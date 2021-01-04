import React from 'react';

type Props = {
  percentage: number;
};

export default function LeaderboardsProgressBar(props: Props): JSX.Element {
  const { percentage } = props;
  return (
    <div className="leaderboards-member-completion">
      <div
        className="leaderboards-member-completion-progress"
        style={{ width: `${percentage * 2}px` }}></div>
      <div className="leaderboards-member-completion-percentage">{`${percentage}%`}</div>
    </div>
  );
}
