import { createGlobalStyle } from 'styled-components';
import { colors, fonts, media } from 'shared/theme';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
  html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: ${colors.black};
    overflow-x: hidden;
  }
  
  div {
    user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }
  a {
    text-decoration: none;
    color: ${colors.superLightGrey};
    &:hover {
      text-decoration: underline;
    }
  }

  .display-none {
    display: none;
  }
  .bold {
    font-weight: bold;
  }
  .under {
    text-decoration: underline;
  }

  .custom-button, .ban-button {
    background-color: ${colors.superDarkGrey};
    color: ${colors.superLightGrey};
    border: none;
    font-family: ${fonts.Dosis};
    letter-spacing: 0.3em;
    text-transform: uppercase;
    cursor: pointer;
    &:hover {
      background-color: ${colors.newMediumGrey};
    }
  }
  .custom-button {
    height: 40px;
    font-size: 1.3em;
  }
  .ban-button {
    height: 32px;
    box-sizing: border-box;
  }
  .button-blocked {
    cursor: not-allowed;
  }

  .wrapper-page {
    padding: 0;
    box-sizing: border-box;
    margin: 30px 30px 0 0;
    p {
      margin: 0 0 10px 0
    }
    @media (max-width: ${media.netbooks}) {
      margin: 0
    }
  }

  .page-description {
    padding: 0 0 10px 0;
    margin: 0 0 10px 0;
    box-sizing: border-box;
    &.fancy {
      padding: 10px;
    }
  }

  .wrapper-filter {
    display: flex;
    justify-content: space-around;
    @media (max-width: ${media.tablets}) {
      flex-direction: column;
      justify-content: center;
    }
  }
  .wrapper-choicebar {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
  }
  .game-choice-checkbox {
    display: none;
    &:not(:checked) + label {
      color: ${colors.newMediumGrey}
    }
  }
  .checkbox-label {
    margin: 0px 30px;
    font-size: 1.4em;
    cursor: pointer;
  }

  .icon-hover {
    margin-left: 10px;
    transition: transform 300ms;
    transition-timing: ease-out;
    font-size: 1.35em;
    &:hover {
      text-shadow: 0 0 10px ${colors.lightYellow};
    }
  }
  .icon-active {
    transform: rotate(180deg);
  }

  .dummy {
    @media (min-width: ${media.tablets}) {
      display: none;
    }
  }

  .button {
    padding: 5px 10px;
    opacity: 0.7;
    p {
      margin: 0 10px
    }
    &:hover {
      cursor: pointer;
      opacity: 1;
      color: ${colors.lightYellow};
    }
  }
`;

export default GlobalStyle;
