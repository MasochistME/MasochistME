import React from 'react';
import styled from 'styled-components';

import { Flex, Tooltip } from 'components';
import { Game } from '@masochistme/sdk/dist/v1/types';

type Props = {
	game?: Game;
	children: React.ReactElement;
};

export const GameTooltip = (props: Props) => {
	const { game, children } = props;

	const gameTitle = (game?.title ?? '—').toUpperCase();

	return (
		<Tooltip
			content={
				game ? (
					<StyledTooltip column>
						<div style={{ gap: 'var(--size-4)' }}>
							<span style={{ fontWeight: 'bold' }}>{gameTitle}</span>
						</div>
					</StyledTooltip>
				) : null
			}>
			{children}
		</Tooltip>
	);
};

const StyledTooltip = styled(Flex)`
	text-align: left;
`;
