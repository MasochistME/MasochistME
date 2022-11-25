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
		<Flex
			row
			alignItems={isCentered ? 'center' : 'inherit'}
			justifyContent={isCentered ? 'center' : 'inherit'}
			whiteSpace={isNoWrap ? 'nowrap' : 'inherit'}
			{...style}>
			{content}
		</Flex>
	);
};
