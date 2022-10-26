import { createGlobalStyle } from 'styled-components';

import { colors } from 'styles/theme/themeOld';
import { ColorTokens, AssetTokens } from './theme';

const GlobalStyle = createGlobalStyle<{
	colorTokens: ColorTokens;
	assetTokens: AssetTokens;
}>`
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
    background-image: url(${({ assetTokens }) =>
			assetTokens['core-background']});
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
    text-decoration: underline dotted;
    color: ${({ colorTokens }) => colorTokens['semantic-color-active']};
    &:hover {
      text-decoration: underline dotted;
      color: ${({ colorTokens }) => colorTokens['semantic-color-link-hover']}
    }
  }
`;

export default GlobalStyle;
