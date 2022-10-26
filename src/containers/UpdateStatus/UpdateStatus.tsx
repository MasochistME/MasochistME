import React from 'react';
import styled from 'styled-components';

import { useUpdateStatus } from 'sdk';
import { Flex, ProgressBar } from 'components';
import { HideOn } from 'containers';
import { ColorTokens, useTheme } from 'styles';

export const UpdateStatus = (): JSX.Element => {
	const { updateData: status } = useUpdateStatus();
	const { colorTokens } = useTheme();

	const nextUpdate = status?.lastUpdate
		? new Date(
				new Date(status.lastUpdate).getTime() + 43200000,
		  ).toLocaleString()
		: 'loading...';

	return (
		<HideOn media="smallNetbooks" flex="1 0 450px" display="flex">
			<StyledUpdateStatus column align justify colorTokens={colorTokens}>
				{!status?.isUpdating || status.updateStatus === 'idle' ? (
					<StyledUpdateStatusText>
						Next update: {nextUpdate}
					</StyledUpdateStatusText>
				) : (
					<ProgressBar
						percentage={status?.updateProgress ?? 100}
						style={{ height: '30px', width: '100%' }}
						invert
					/>
				)}
			</StyledUpdateStatus>
		</HideOn>
	);
};

const StyledUpdateStatus = styled(Flex)<{ colorTokens: ColorTokens }>`
	color: ${({ colorTokens }) =>
		colorTokens['semantic-color-section-update--text']};
	background-color: ${({ colorTokens }) =>
		colorTokens['semantic-color-section-update--bg']};
	flex: 1 0 450px;
`;

const StyledUpdateStatusText = styled.h3`
	text-align: center;
	font-size: 18px;
	font-family: 'Dosis', 'Raleway', Verdana, sans-serif;
`;
