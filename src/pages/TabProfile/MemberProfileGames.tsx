import { LeaderboardsMemberCollapse } from 'pages/TabLeaderboards/LeaderboardsMemberCollapse';

type Props = { memberId: string };

export const MemberProfileGames = (props: Props) => {
	const { memberId } = props;
	return <LeaderboardsMemberCollapse steamId={memberId} />;
};
