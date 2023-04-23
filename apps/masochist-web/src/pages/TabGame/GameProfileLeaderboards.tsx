import { GameLeaderboards } from 'containers';

type Props = { gameId: number };

export const GameProfileLeaderboards = (props: Props) => {
	const { gameId } = props;
	return <GameLeaderboards gameId={gameId} />;
};
