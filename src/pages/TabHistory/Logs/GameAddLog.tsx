import React from 'react';
import { useNavigate } from 'react-router';
import { Game, Tier, LogGameAdd } from '@masochistme/sdk/dist/v1/types';

import { useAllGames, useTiers } from 'sdk';
import { GameThumbnail } from 'containers';
import { Icon, IconType } from 'components';
import { Size } from 'components';

import { HistoryLog } from '.';

type Props = {
	log: LogGameAdd;
};

export const GameAddLog = (props: Props): JSX.Element | null => {
	const { log } = props;
	const navigate = useNavigate();

	const { tiersData } = useTiers();
	const { gamesData: games } = useAllGames();

	const game = games.find((g: Game) => g.id === log.gameId);
	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);

	const iconGameAdd = game ? 'SquarePlus' : 'WarningTriangle';
	const iconGameRating = (
		gameRating ? gameRating.icon : 'QuestionCircle'
	) as IconType;

	const onGameClick = () => {
		navigate(`/game/${log.gameId}`);
	};

	return (
		<HistoryLog>
			<HistoryLog.Logo />
			<HistoryLog.Description>
				<HistoryLog.Link onClick={onGameClick}>
					{game ? game.title : `Game ${log.gameId}`}
				</HistoryLog.Link>
				<span>has been curated!</span>
			</HistoryLog.Description>
			<HistoryLog.Summary>
				<HistoryLog.Icons>
					<Icon icon={iconGameAdd} />
					<Icon icon={iconGameRating} />
				</HistoryLog.Icons>
				<GameThumbnail game={game} size={Size.SMALL} onClick={onGameClick} />
			</HistoryLog.Summary>
		</HistoryLog>
	);
};
