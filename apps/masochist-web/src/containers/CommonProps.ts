import { Size } from 'components';
import React from 'react';

export type CommonProps = {
  size?: Size;
  title?: React.ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onClick?: () => void;
};
