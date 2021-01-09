import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0 10px 10px 10px;
  box-sizing: border-box;
  box-shadow: 0 0 20px ${colors.superDarkGrey};
  background-color: ${colors.superLightGrey}11;
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
    background-color: ${colors.newDark}dd;
    color: ${colors.superLightGrey};
    p {
      margin: 0;
    }
  }
`;

export default Section;
