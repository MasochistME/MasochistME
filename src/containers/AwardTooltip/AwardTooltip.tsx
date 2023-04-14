import React from 'react';
import styled from 'styled-components';
import { Award } from '@masochistme/sdk/dist/v1/types';

import { Flex, Size, Tooltip } from 'components';
import { AwardThumbnail } from 'containers/AwardThumbnail/AwardThumbnail';

type Props = {
	award: Award;
	isUnlocked: boolean;
	children: React.ReactElement;
};

export const AwardTooltip = (props: Props) => {
	const { award, isUnlocked, children } = props;

	return (
		<Tooltip
			content={
				award ? (
					<StyledTooltip>
						<AwardThumbnail
							award={award}
							isUnlocked={isUnlocked}
							hasTooltip={false}
							size={Size.BIG}
						/>
						<Flex column>
							<h3 style={{ fontWeight: 'bold', margin: 0 }}>{award.name}</h3>
							<span style={{ fontStyle: 'italic' }}>{award.description}</span>
							<span
								style={{
									alignSelf: 'flex-end',
									fontStyle: 'italic',
									fontSize: 'var(--font-size-10)',
								}}>
								Click for more info
							</span>
						</Flex>
					</StyledTooltip>
				) : null
			}>
			{children}
		</Tooltip>
	);
};

const StyledTooltip = styled(Flex)`
	gap: var(--size-8);
`;
