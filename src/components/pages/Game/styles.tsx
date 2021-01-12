import styled from 'styled-components';
import { colors, media } from 'shared/theme';

export const Image = styled.img`
  /* width: 128px;
  min-width: 128px; */
  height: 128px;
  min-height: 128px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 10px ${colors.black};
  padding: 2px;
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;

export const EmptyImage = styled.div`
  width: 128px;
  min-width: 128px;
  height: 128px;
  min-height: 128px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 10px ${colors.black};
  background-color: ${colors.black};
  padding: 2px;
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;

export const Basic = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.superDarkGrey}48;
  margin-bottom: 10px;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 0 5px ${colors.superDarkGrey};
  border-bottom: 1px solid ${colors.mediumGrey};
  border-right: 1px solid ${colors.mediumGrey};
  border-left: 1px solid ${colors.superDarkGrey};
  border-top: 1px solid ${colors.superDarkGrey};
`;
