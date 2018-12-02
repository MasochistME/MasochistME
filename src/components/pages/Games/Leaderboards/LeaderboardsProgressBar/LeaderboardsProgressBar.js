import React from 'react'

const LeaderboardsProgressBar = ({ percentage }) => 
    <div className="leaderboards-member-completion">
        <div className="leaderboards-member-completion-progress" style={{ width: `${percentage*2}px` }}></div>
        <div className="leaderboards-member-completion-percentage">{ `${percentage}%` }</div>
    </div>
    
export default LeaderboardsProgressBar
