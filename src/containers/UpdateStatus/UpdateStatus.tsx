import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { colors } from 'shared/theme';
import { Flex, ProgressBar } from 'components';
import { HideOn } from 'containers';

export const UpdateStatus = (): JSX.Element => {
	const status = useSelector((state: any) => state.status);
	const nextUpdate = status?.lastUpdated
		? new Date(status.lastUpdated + 43200000).toLocaleString()
		: 'loading...';

	return (
		<HideOn media="smallNetbooks" flex="1 0 450px" display="flex">
			<StyledUpdateStatus column align justify>
				{!status.percentage || status.percentage === 100 ? (
					<StyledUpdateStatusText>
						Next update: {nextUpdate}
					</StyledUpdateStatusText>
				) : (
					<ProgressBar
						percentage={status?.percentage ?? 100}
						style={{ height: '30px', width: '100%' }}
						invert
					/>
				)}
			</StyledUpdateStatus>
		</HideOn>
	);
};

const StyledUpdateStatus = styled(Flex)`
	background-color: ${colors.black};
	flex: 1 0 450px;
`;

const StyledUpdateStatusText = styled.h3`
	text-align: center;
	font-size: 18px;
	font-family: 'Dosis', 'Raleway', Verdana, sans-serif;
`;
