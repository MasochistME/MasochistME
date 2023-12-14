import React from 'react';
import styled from 'styled-components';
import { MemberCheese } from '@masochistme/sdk/dist/v1/types';

import { CommonProps } from 'containers';
import { QueryBoundary, Size, Skeleton } from 'components';
import { ColorTokens, useTheme } from 'styles';
import { Tooltip } from 'components';
import { CHEESE_IMG } from 'utils';

type Props = CommonProps & {
  cheese?: MemberCheese;
};

export const CheeseThumbnail = (props: Props) => {
  const { colorTokens } = useTheme();
  const { cheese, isLoading, size = Size.MEDIUM } = props;

  if (isLoading || !cheese) return <Skeleton size={size} />;

  return (
    <QueryBoundary fallback={null}>
      <Tooltip content="CHEESED!">
        <StyledCheeseThumbnail size={size} colorTokens={colorTokens}>
          <img src={CHEESE_IMG} alt="Cheese badge" loading="lazy" />
        </StyledCheeseThumbnail>
      </Tooltip>
    </QueryBoundary>
  );
};

const StyledCheeseThumbnail = styled.div.attrs(
  (props: Pick<Props, 'size'> & { colorTokens: ColorTokens }) => {
    const { size } = props;
    const style: React.CSSProperties = {
      minWidth: `${size}rem`,
      minHeight: `${size}rem`,
      maxWidth: `${size}rem`,
      maxHeight: `${size}rem`,
    };
    return { style };
  },
)<Pick<Props, 'size'> & { colorTokens: ColorTokens }>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  /* padding: var(--size-2); */
  border-radius: ${({ size }) =>
    size === Size.SMALL || size === Size.TINY
      ? `var(--border-radius-4)`
      : `var(--border-radius-8)`};
  border: ${({ size, colorTokens }) => {
    const borderSize = size === Size.SMALL || size === Size.TINY ? 0.2 : 0.3;
    const borderColor = colorTokens['common-color--red'];
    return `${borderSize}rem solid ${borderColor}`;
  }};
  cursor: help;

  img {
    width: 100%;
    height: 100%;
    opacity: ${({ size }) =>
      size === Size.SMALL || size === Size.TINY ? 0.85 : 1};
  }
`;
