import styled from 'styled-components';

type Props = {
	row?: boolean;
	column?: boolean;
	justify?: boolean;
	align?: boolean;
} & React.CSSProperties;

export const Flex = styled.div.attrs((props: Props) => {
	const { row, column, justify, align, ...style } = props;
	const newStyle: React.CSSProperties = {};
	if (row) newStyle.flexDirection = 'row';
	if (column) newStyle.flexDirection = 'column';
	if (justify) newStyle.justifyContent = 'center';
	if (align) newStyle.alignItems = 'center';
	return {
		style: newStyle,
		...style,
	};
})<Props>`
	display: flex;
`;
