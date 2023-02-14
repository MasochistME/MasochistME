import React, { useMemo } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { fonts, media } from 'styles';
import { getHumanReadableDate } from 'utils';
import { Flex } from '../Flex';

type Props = {
	date?: Date | number;
	withHours?: boolean;
	shouldHide?: boolean;
} & React.CSSProperties;

export const DateBlock = (props: Props) => {
	const { date, withHours = true, shouldHide = true, ...style } = props;

	const fixedDate = useMemo(() => {
		return getHumanReadableDate(date);
	}, [date]);
	const fixedTime = useMemo(() => {
		return dayjs(date).format('H:mm');
	}, [date]);

	return (
		<StyledDateBlock style={style} shouldHide={shouldHide}>
			{!date && (
				<Flex justify align width="100%">
					—
				</Flex>
			)}
			{date && (
				<>
					<span>{fixedDate}</span>
					{withHours && <span>{fixedTime}</span>}
				</>
			)}
		</StyledDateBlock>
	);
};

const StyledDateBlock = styled(Flex)<{ shouldHide: boolean }>`
	flex: 1 0 90px;
	flex-wrap: nowrap;
	flex-direction: column;
	padding: 0 4px;
	font-size: 14px;
	font-family: ${fonts.Dosis};
	line-height: 1.2em;
	@media (max-width: ${media.tablets}) {
		display: ${({ shouldHide }) => (shouldHide ? 'none !important' : 'flex')};
	}
`;
