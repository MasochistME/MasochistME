import React, { useMemo } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Flex } from './Flex';

type Props = {
	date?: Date | number;
} & React.CSSProperties;

export const DateBlock = (props: Props) => {
	const { date, ...style } = props;

	const fixedDate = useMemo(() => {
		return dayjs(date).format('DD MMM YY');
	}, []);
	const fixedTime = useMemo(() => {
		return dayjs(date).format('H:mm:ss');
	}, []);

	return (
		<StyledDateBlock style={style}>
			<span>{fixedDate}</span>
			<span>{fixedTime}</span>
		</StyledDateBlock>
	);
};

const StyledDateBlock = styled(Flex)`
	flex-direction: column;
	padding: 0 4px;
`;
