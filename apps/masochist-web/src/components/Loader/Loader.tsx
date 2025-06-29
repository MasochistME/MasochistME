import { Flex, Spinner } from 'components';
import React from 'react';

type Props = { title?: React.ReactNode };
export const Loader = ({ title }: Props) => {
  return (
    <Flex column gap={16} align justify boxSizing="border-box" padding={64}>
      <Spinner />
      {title && <div>{title}</div>}
    </Flex>
  );
};
