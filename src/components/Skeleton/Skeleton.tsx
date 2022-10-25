import MUISkeleton from '@mui/material/Skeleton';
import { useAppContext } from 'context';
import { Size } from 'utils';

type Props = {
	size?: Size;
	width?: number | string;
	height?: number | string;
};

export const Skeleton = (props: Props) => {
	const { colorTokens } = useAppContext();
	const { width, height, size = Size.MEDIUM } = props;

	return (
		<MUISkeleton
			sx={{ bgcolor: colorTokens['semantic-color-idle'] }}
			variant="rounded"
			width={width ?? size}
			height={height ?? size}
		/>
	);
};
