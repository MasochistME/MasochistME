import MUISkeleton from '@mui/material/Skeleton';
import { useTheme } from 'styles';
import { Size } from 'components';

type Props = {
	size?: Size;
	width?: number | string;
	height?: number | string;
	style?: React.CSSProperties;
};

export const Skeleton = (props: Props) => {
	const { colorTokens } = useTheme();
	const { width, height, style = {}, size = Size.MEDIUM } = props;

	return (
		<MUISkeleton
			sx={{ bgcolor: colorTokens['semantic-color-idle'] }}
			variant="rounded"
			width={width ?? size}
			height={height ?? size}
			style={style}
		/>
	);
};
