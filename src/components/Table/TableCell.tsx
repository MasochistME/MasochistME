import { Flex } from 'components';

type Props = {
	isCentered?: boolean;
	isNoWrap?: boolean;
	content: string;
};

export const TableCell = (props: Props): JSX.Element => {
	const { isCentered = true, isNoWrap = false, content } = props;

	return (
		<Flex
			row
			alignItems={isCentered ? 'center' : 'inherit'}
			justifyContent={isCentered ? 'center' : 'inherit'}
			whiteSpace={isNoWrap ? 'nowrap' : 'inherit'}>
			{content}
		</Flex>
	);
};
