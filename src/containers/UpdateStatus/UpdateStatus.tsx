import React from 'react';
import styled from 'styled-components';

import { useUpdateStatus } from 'sdk';
import { Flex, ProgressBar, QueryBoundary } from 'components';
import { HideOn } from 'containers';
import { ColorTokens, useTheme } from 'styles';

export const UpdateStatus = (): JSX.Element => {
	const { colorTokens } = useTheme();

	return (
		<HideOn media="smallNetbooks" flex="1 0 45rem" display="flex">
			<StyledUpdateStatus column align justify colorTokens={colorTokens}>
				<QueryBoundary fallback={null}>
					<UpdateStatusBoundary />
				</QueryBoundary>
			</StyledUpdateStatus>
		</HideOn>
	);
};

const UpdateStatusBoundary = () => {
	const { updateData: status } = useUpdateStatus();
	const nextUpdate = status?.lastUpdate
		? new Date(
				new Date(status.lastUpdate).getTime() + 43200000,
		  ).toLocaleString()
		: 'loading...';

	const isStatusIdle = !status?.isUpdating || status.updateStatus === 'idle';
	if (isStatusIdle)
		return (
			<StyledUpdateStatusText>Next update: {nextUpdate}</StyledUpdateStatusText>
		);
	return (
		<ProgressBar
			percentage={status?.updateProgress ?? 100}
			style={{ height: '3rem', width: '100%' }}
			invert
		/>
	);
};

const StyledUpdateStatus = styled(Flex)<{ colorTokens: ColorTokens }>`
	color: ${({ colorTokens }) =>
		colorTokens['semantic-color--section-update--text']};
	background-color: ${({ colorTokens }) =>
		colorTokens['semantic-color--section-update--bg']};
	flex: 1 0 45rem;
`;

const StyledUpdateStatusText = styled.h3`
	text-align: center;
	font-size: var(--font-size-16);
	font-family: 'Dosis', 'Raleway', Verdana, sans-serif;
`;
