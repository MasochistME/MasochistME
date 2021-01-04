import React from 'react';
import MiniHeader from '../../MiniHeader';
import Page from '../../../../components/pages/Page';

export default function ContentWrapper(props: any) {
  return (
    <div className={'wrapper-content'}>
      <MiniHeader />
      <Page {...props} />
    </div>
  );
}
