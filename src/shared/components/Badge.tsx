import styled from 'styled-components';
import { colors } from 'shared/theme';

export const Badge = styled.img`
  max-width: 24px;
  max-height: 24px;
  border: 3px solid black;
  border-radius: 3px;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

export const BigBadge = styled.img`
  border-radius: 10px;
  border: 3px solid ${colors.superLightGrey};
  box-sizing: border-box;
  width: 64px;
  height: 64px;
  min-width: 64px;
  min-height: 64px;
  cursor: pointer;
  box-shadow: 0 0 5px ${colors.superDarkGrey};
  margin: 10px;
`;
