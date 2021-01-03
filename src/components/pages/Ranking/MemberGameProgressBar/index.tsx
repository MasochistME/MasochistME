import React from 'react';

const MemberGameProgressBar = ({ percentage }) => (
  <div className="m-game-completion">
    <div
      className="m-game-completion-progress"
      style={{ width: `${percentage * 2}px` }}></div>
    <div className="m-game-completion-percentage">{`${percentage}%`}</div>
  </div>
);

export default MemberGameProgressBar;
