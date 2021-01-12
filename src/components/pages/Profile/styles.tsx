import styled from 'styled-components';
import { colors } from 'shared/theme';

export const Badges = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

export const Badge = styled.img`
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
