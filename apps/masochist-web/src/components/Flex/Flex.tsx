import { Size } from 'components';
import React from 'react';
import styled from 'styled-components';

type FlexStyleProps = {
  row?: boolean;
  column?: boolean;
  justify?: boolean;
  align?: boolean;
  width?: string | Size;
  height?: string | Size;
  // Any other CSS style that can be added as a prop as opposed to via { style }
  [key: string]: unknown;
};

type NativeDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>;
type Props = FlexStyleProps & NativeDivProps;

export const Flex = styled.div.attrs<Props>(props => {
  const {
    row,
    column,
    justify,
    align,
    children: _c, // ignore this
    theme: _t, // ignore this
    ...style
  } = props;

  const flexStyle: React.CSSProperties = {
    ...(row ? { flexDirection: 'row' } : {}),
    ...(column ? { flexDirection: 'column' } : {}),
    ...(justify ? { justifyContent: 'center' } : {}),
    ...(align ? { alignItems: 'center' } : {}),
  };

  return {
    style: {
      ...flexStyle,
      ...style,
    },
  };
})<Props>`
  display: flex;
`;
