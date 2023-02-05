import { Badge } from '@masochistme/sdk/dist/v1/types';
import { useHistory } from 'react-router';

import { TableCell, TableLink } from 'components';
import { useCuratedGames } from 'sdk';
import { useTheme } from 'styles';

type Props = { badge: Badge };

export const CellGame = ({ badge }: Props) => {
	const history = useHistory();
	const { colorTokens } = useTheme();
	const { gamesData: games } = useCuratedGames();

	const game = games.find(g => g.id === badge.gameId);
	const gameTitle = game?.title ?? badge.title ?? '—';

	const onGameClick = (gameId?: number | null) => {
		if (gameId) history.push(`/game/${gameId}`);
	};

	return (
		<TableCell
			content={
				<TableLink
					colorTokens={colorTokens}
					onClick={() => onGameClick(game?.id)}>
					{gameTitle}
				</TableLink>
			}
			justifyContent="flex-start"
			textAlign="left"
		/>
	);
};
