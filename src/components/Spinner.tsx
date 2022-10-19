import React from 'react';
import styled from 'styled-components';

import { Flex } from 'components';
import { colors } from 'shared/theme';

export const Spinner = (): JSX.Element => {
	return (
		<StyledSpinner align justify>
			<i className="fas fa-circle-notch fa-spin" />
		</StyledSpinner>
	);
};

const StyledSpinner = styled(Flex)`
	box-sizing: border-box;
	font-size: 32px;
	color: ${colors.lightGrey};
`;
