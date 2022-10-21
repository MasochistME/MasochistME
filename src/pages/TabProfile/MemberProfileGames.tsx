import { MemberLeaderboards } from 'containers';

type Props = { memberId: string };

export const MemberProfileGames = (props: Props) => {
	const { memberId } = props;
	return <MemberLeaderboards steamId={memberId} />;
};
