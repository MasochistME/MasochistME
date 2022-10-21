import MUISkeleton from '@mui/material/Skeleton';
import { Size } from 'utils';

type Props = {
	size?: Size;
	width?: number | string;
	height?: number | string;
};

export const Skeleton = (props: Props) => {
	const { width, height, size = Size.MEDIUM } = props;
	return (
		<MUISkeleton
			variant="rounded"
			width={width ?? size}
			height={height ?? size}
		/>
	);
};
