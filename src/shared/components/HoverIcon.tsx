import React from 'react';
import styled from 'styled-components';
import { colors } from 'shared/theme';

const HoverWrapper = styled.div.attrs(
  ({ active, style }: { active: boolean; style?: any }) => {
    const newStyle: any = {
      ...style,
      backgroundColor: `${colors.newDark}22`,
    };
    if (active) {
      newStyle.backgroundColor = `${colors.lightGrey}44`;
    }
    return { style: newStyle };
  },
)<{ active: boolean; style?: any }>`
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${colors.newDark}66;
  }
`;

type Props = {
  type: string;
  isActive: boolean;
  style?: any;
  onClick: () => any;
};

export default function HoverIcon(props: Props): JSX.Element {
  const { type, isActive, style, onClick } = props;
  return (
    <HoverWrapper active={isActive} onClick={onClick} style={style}>
      <i className={type} />
    </HoverWrapper>
  );
}
