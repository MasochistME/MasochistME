import React from 'react';

type Props = {
	percentage: number;
};

export const LeaderboardsProgressBar = (props: Props): JSX.Element => {
	const { percentage } = props;
	return (
		<div className="leaderboards-user-completion">
			<div
				className="leaderboards-user-completion-progress"
				style={{ width: `${percentage * 1}px` }}></div>
			<div className="leaderboards-user-completion-percentage">{`${percentage}%`}</div>
		</div>
	);
};
