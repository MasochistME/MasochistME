import React from 'react';
import styled from 'styled-components';

import { Flex, Icon, Size } from 'components';
import { colors } from 'styles/theme/themeOld';

type Props = {
	children: React.ReactNode;
};

export const EventCompact = (props: Props) => {
	const { children } = props;
	return <StyledEventCompact>{children}</StyledEventCompact>;
};

const StyledEventCompact = styled(Flex)`
	gap: 4px;
	width: 100%;
	margin: 0px;
	box-sizing: border-box;
	&(:Icon) {
		color: red;
	}
`;

const EventIcon = (props: React.ComponentProps<typeof Icon>) => (
	<Icon size={Size.TINY} {...props} />
);

EventCompact.Icon = EventIcon;
EventCompact.Link = styled.span`
	cursor: pointer;
	font-weight: bold;
	&:hover {
		color: ${colors.white};
	}
`;
