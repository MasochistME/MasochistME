import MUISkeleton from '@mui/material/Skeleton';
import { colors } from 'shared/theme';
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
			sx={{ bgcolor: colors.newMediumGrey }}
			variant="rounded"
			width={width ?? size}
			height={height ?? size}
		/>
	);
};
