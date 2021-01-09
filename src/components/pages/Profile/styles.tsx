import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';

export const WrapperProfile = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: ${colors.darkBlueTransparent};
`;

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
  cursor: help;
  box-shadow: 0 0 5px ${colors.superDarkGrey};
  margin: 10px;
`;

export const Section = styled.div`
  padding: 0;
  margin: 0 10px 10px 10px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 0 20px ${colors.superDarkGrey};
  background-color: rgba(${colors.superLightGrey}, 0.1);
  canvas {
    margin: 10px 0 10px 0;
  }
  h3 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 5px 0 5px;
    margin: 0;
    font-size: 1.3em;
    text-transform: uppercase;
    font-family: ${fonts.Dosis};
    text-transform: uppercase;
    background-color: rgba(${colors.newDark}, 0.8);
    color: ${colors.superLightGrey};
    p {
      margin: 0;
    }
  }
`;
