import styled from 'styled-components';
import { Flex } from 'components';

type Props = {
	isCentered?: boolean;
	isNoWrap?: boolean;
	content?: React.ReactNode | number;
} & Partial<
	Omit<React.CSSProperties, 'width' | 'height' | 'translate' | 'content'>
>;

export const TableCell = (props: Props): JSX.Element => {
	const {
		isCentered = true,
		isNoWrap = false,
		content = '—',
		...style
	} = props;

	return (
		<StyledTableCell
			alignItems={isCentered ? 'center' : 'inherit'}
			justifyContent={isCentered ? 'center' : 'inherit'}
			whiteSpace={isNoWrap ? 'nowrap' : 'inherit'}
			{...style}>
			{content}
		</StyledTableCell>
	);
};

const StyledTableCell = styled(Flex)`
	font-size: var(--font-size-14);
`;
