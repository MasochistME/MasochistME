import { Badge } from '@masochistme/sdk/dist/v1/types';
import { TableCell, TableLink } from 'components';
import { Link } from 'react-router-dom';
import { useCuratedGames } from 'sdk';
import { useTheme } from 'styles';

type Props = { badge: Badge };

export const CellGame = ({ badge }: Props) => {
  const { colorTokens } = useTheme();
  const { gamesData: games } = useCuratedGames();

  const game = games.find(g => g.id === badge.gameId);
  const gameTitle = game?.title ?? badge.title ?? '—';

  const to = `/game/${game?.id ?? 'NO_ID'}`;

  return (
    <TableCell
      content={
        <TableLink colorTokens={colorTokens}>
          <Link to={to}>{gameTitle}</Link>
        </TableLink>
      }
      justifyContent="flex-start"
      textAlign="left"
    />
  );
};
