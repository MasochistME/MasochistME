import React from 'react';
import styled from 'styled-components';
import { media, colors } from 'shared/theme';
import MiniHeader from 'shared/components/MiniHeader';
import Page from 'components/pages/Page';

const StyledWrapperContent = styled.div`
  position: relative;
  width: 70%;
  height: auto;
  box-sizing: border-box;
  color: ${colors.superLightGrey};
  @media (max-width: ${media.netbooks}) {
    width: 100%;
  }
`;

export default function ContentWrapper(props: any): JSX.Element {
  return (
    <StyledWrapperContent>
      <MiniHeader />
      <Page {...props} />
    </StyledWrapperContent>
  );
}
