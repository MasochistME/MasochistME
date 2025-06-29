import MUISkeleton from '@mui/material/Skeleton';
import { Size } from 'components';
import { useTheme } from 'styles';

type Props = {
  size?: Size;
  variant?: 'rounded' | 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

export const Skeleton = (props: Props) => {
  const { colorTokens } = useTheme();
  const {
    width,
    height,
    variant = 'rounded',
    style = {},
    size = Size.MEDIUM,
  } = props;

  return (
    <MUISkeleton
      sx={{ bgcolor: colorTokens['semantic-color--idle'] }}
      variant={variant}
      width={width ?? `${size}rem`}
      height={height ?? `${size}rem`}
      style={style}
    />
  );
};
