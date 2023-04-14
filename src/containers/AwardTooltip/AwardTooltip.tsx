import React from 'react';
import styled from 'styled-components';
import { useAward } from 'sdk';

import { Flex, Size, Tooltip } from 'components';
import { AwardThumbnail } from 'containers/AwardThumbnail/AwardThumbnail';

type Props = {
	awardId: string;
	isUnlocked: boolean;
	children: React.ReactElement;
};

export const AwardTooltip = (props: Props) => {
	const { awardId, isUnlocked, children } = props;
	const { awardData: award } = useAward(awardId);

	return (
		<Tooltip
			content={
				award ? (
					<StyledTooltip>
						<AwardThumbnail
							awardId={awardId}
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
