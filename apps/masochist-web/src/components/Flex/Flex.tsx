import styled from 'styled-components';
import { Size } from 'components';

type PropsIgnore = {
  children?: React.ReactNode;
  theme?: any;
};
type Props = {
  row?: boolean;
  column?: boolean;
  justify?: boolean;
  align?: boolean;
  width?: string | Size;
  height?: string | Size;
} & PropsIgnore &
  Omit<React.CSSProperties, 'width' | 'height'>;

export const Flex = styled.div.attrs((props: Props) => {
  const {
    row,
    column,
    justify,
    align,
    children: _c, // ignore
    theme: _t, // ignore
    ...style
  } = props;
  const newStyle: React.CSSProperties = {};
  if (row) newStyle.flexDirection = 'row';
  if (column) newStyle.flexDirection = 'column';
  if (justify) newStyle.justifyContent = 'center';
  if (align) newStyle.alignItems = 'center';
  return {
    style: { ...newStyle, ...style },
  };
})<Props>`
  display: flex;
`;
