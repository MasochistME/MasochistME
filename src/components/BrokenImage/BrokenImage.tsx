import styled from 'styled-components';

import { Size } from 'components';

import { Icon } from '../Icon';
import { Flex } from '../Flex';
import { Tooltip } from '../Tooltip';

type Props = {
	title?: string;
	size?: Size;
	width?: string; // unused
	height?: string; // unused
};

export const BrokenImage = (props: Props) => {
	const { title, size } = props;

	return (
		<Tooltip content={title ?? 'I could not load :('}>
			<StyledBrokenImg size={size}>
				<Icon icon="WarningTriangle" size={size} />
			</StyledBrokenImg>
		</Tooltip>
	);
};

const StyledBrokenImg = styled(Flex)<{ size?: Size }>`
	font-size: ${({ size }) => (size ? `${size / 2}rem` : 'var(--font-size-16)')};
	box-sizing: border-box;
	align-items: center;
	justify-content: center;
`;
