import React from 'react';
import styled from 'styled-components';

import { Flex, Icon, Size } from 'components';
import { useTheme, ColorTokens } from 'styles';

type Props = {
	children: React.ReactNode;
	onClick?: () => void;
	style?: React.CSSProperties;
};

export const EventCompact = (props: Pick<Props, 'children'>) => {
	const { children } = props;
	return <StyledEventCompact>{children}</StyledEventCompact>;
};

const StyledEventCompact = styled(Flex)`
	align-items: center;
	gap: 4px;
	width: 100%;
	margin: 0px;
	box-sizing: border-box;
	&(:Icon) {
		color: red;
	}
`;

const EventLink = (props: Props) => {
	const { children, style = {}, onClick } = props;
	const { colorTokens } = useTheme();
	return (
		<StyledEventLink
			colorTokens={colorTokens}
			style={style}
			{...(onClick && { onClick })}>
			{children}
		</StyledEventLink>
	);
};

const StyledEventLink = styled.span<{ colorTokens: ColorTokens }>`
	cursor: pointer;
	font-weight: bold;
	&:hover {
		color: ${({ colorTokens }) => colorTokens['semantic-color--link-hover']};
	}
`;

const EventIcon = (props: React.ComponentProps<typeof Icon>) => (
	<Icon size={Size.MICRO} {...props} />
);

EventCompact.Icon = EventIcon;
EventCompact.Link = EventLink;
