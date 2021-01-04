import React from 'react';

type Props = {
  percentage: number;
};

export default function MemberGameProgressBar(props: Props): JSX.Element {
  const { percentage } = props;
  return (
    <div className="m-game-completion">
      <div
        className="m-game-completion-progress"
        style={{ width: `${percentage * 2}px` }}></div>
      <div className="m-game-completion-percentage">{`${percentage}%`}</div>
    </div>
  );
}
