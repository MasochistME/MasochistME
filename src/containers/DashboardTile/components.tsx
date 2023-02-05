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

const StyledEventCompact = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	margin: 0px;
	box-sizing: border-box;
	gap: 8px;
	&(:Icon) {
		color: red;
	}
`;

EventCompact.Link = (props: Props) => {
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

EventCompact.Icon = (props: React.ComponentProps<typeof Icon>) => (
	<Flex flex="0 0 auto">
		<Icon size={Size.MICRO} {...props} />
	</Flex>
);

EventCompact.Block = styled.div`
	display: inline-block;
	text-align: left;
	& > * {
		margin-right: 4px;
	}
`;
