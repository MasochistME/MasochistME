import React, { useMemo } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Flex } from './Flex';
import { fonts } from 'shared/theme';

type Props = {
	date?: Date | number;
} & React.CSSProperties;

export const DateBlock = (props: Props) => {
	const { date, ...style } = props;

	const fixedDate = useMemo(() => {
		return dayjs(date).format('DD MMM YYYY');
	}, []);
	const fixedTime = useMemo(() => {
		return dayjs(date).format('H:mm');
	}, []);

	return (
		<StyledDateBlock style={style}>
			<span>{fixedDate}</span>
			<span>{fixedTime}</span>
		</StyledDateBlock>
	);
};

const StyledDateBlock = styled(Flex)`
	flex: 0 0 auto;
	flex-wrap: nowrap;
	flex-direction: column;
	padding: 0 4px;
	font-size: 14px;
	font-family: ${fonts.Dosis};
	line-height: 1.2em;
`;
