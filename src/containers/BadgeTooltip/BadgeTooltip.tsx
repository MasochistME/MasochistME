import React from 'react';

import { Tooltip } from 'components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

type Props = {
	badge?: Badge;
	children: React.ReactElement;
};

export const BadgeTooltip = (props: Props) => {
	const { badge, children } = props;

	return (
		<Tooltip
			content={
				badge ? (
					<>
						<span>
							{badge.name} ({badge.points} pts)
						</span>
						<span style={{ maxWidth: '250px', fontStyle: 'italic' }}>
							{badge.description}
						</span>
					</>
				) : null
			}>
			{children}
		</Tooltip>
	);
};
