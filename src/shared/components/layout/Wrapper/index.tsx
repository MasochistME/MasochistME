import React from 'react';

type WrapperProps = {
  type: string;
  children: React.ReactChildren;
};

export default function Wrapper(props: WrapperProps): JSX.Element {
  const { type, children } = props;
  return <div className={`wrapper-${type}`}>{children}</div>;
}
