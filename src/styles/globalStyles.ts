import { createGlobalStyle } from 'styled-components';

import { colors } from 'shared/theme';
import backgroundImg from 'shared/images/bg.jpg';

const GlobalStyle = createGlobalStyle`
  .ReactCollapse--collapse {
    width: 100%;
  }

  html {
    background-color: ${colors.black};
    overflow-x: hidden;
  }

  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: auto;
    min-height: 100vh;
    background-image: url(${backgroundImg});
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    font-family: 'Raleway';
    text-align: justify;
  }
  
  #root {
    flex: 1 0 100%;
  }

  div {
    user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }
  a {
    color: ${colors.white};
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default GlobalStyle;
