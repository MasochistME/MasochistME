import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useGameDetails } from 'components/init';
import { Flex, Spinner, CustomButton } from 'shared/components';
import { WrapperLeaderboards } from './styles';
import { List } from './List';
import { Badges } from './Badges';

type Props = {
	id: any;
	rating: any;
	compact?: boolean;
};

export const ModalLeaderboards = (props: Props): JSX.Element | null => {
	const { id, compact } = props;
	const history = useHistory();
	const loaded = useGameDetails(id);
	const game = useSelector((state: any) => {
		const gameBasic = state.games.list.find(
			(g: any) => Number(g.id) === Number(id),
		);
		const gameDetails = state.games.details.find(
			(g: any) => Number(g.id) === Number(id),
		);
		return {
			...gameBasic,
			...gameDetails,
		};
	});

	const onShowGame = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		history.push(`/game/${id}`);
		event.stopPropagation();
	};

	return (
		<WrapperLeaderboards>
			<Flex
				row
				align
				style={{
					justifyContent: 'space-between',
					borderBottom: '1px solid #444',
					marginBottom: '12px',
				}}>
				<h2 style={{ borderBottom: 0 }}>
					<a
						href={`https://store.steampowered.com/app/${game?.id ?? ''}`}
						target="_blank"
						rel="noopener noreferrer"
						onClick={event => event.stopPropagation()}>
						<i className="fab fa-steam" /> {game?.title ?? 'Loading...'}
					</a>
				</h2>
				<CustomButton onClick={onShowGame}>Details</CustomButton>
			</Flex>
			{loaded && game ? (
				<Flex column>
					{game.badges?.length ? <Badges game={game} mini /> : null}
					<ModalLeaderboards.List game={game} compact={compact} />
				</Flex>
			) : (
				<Spinner />
			)}
		</WrapperLeaderboards>
	);
};

ModalLeaderboards.List = List;
