import { Flex, Icon, Size } from 'components';
import React from 'react';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export const LogCompact = (props: Pick<Props, 'children'>) => {
  const { children } = props;
  return <StyledLogCompact>{children}</StyledLogCompact>;
};

const StyledLogCompact = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  gap: var(--size-8);
`;

LogCompact.Link = (props: Props) => {
  const { children, style = {}, onClick } = props;
  const { colorTokens } = useTheme();
  return (
    <StyledLogLink
      colorTokens={colorTokens}
      style={style}
      {...(onClick && { onClick })}>
      {children}
    </StyledLogLink>
  );
};

const StyledLogLink = styled.span<{ colorTokens: ColorTokens }>`
  cursor: pointer;
  font-weight: 600;
  &:hover {
    color: ${({ colorTokens }) => colorTokens['semantic-color--link-hover']};
  }
`;

LogCompact.Icon = (props: React.ComponentProps<typeof Icon>) => (
  <Flex flex="0 0 auto">
    <Icon size={Size.MICRO} {...props} />
  </Flex>
);

LogCompact.Block = styled.div`
  display: inline-block;
  text-align: left;
  & > * {
    margin-right: var(--size-4);
  }
`;
