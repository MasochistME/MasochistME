type Props = { gameId: number };

export const GameProfileBadges = (props: Props) => {
	const { gameId } = props;
	return <div>{gameId} - TODO</div>;
};
