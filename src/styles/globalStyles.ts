import { createGlobalStyle } from 'styled-components';
import { ColorTokens, AssetTokens } from './theme';

const GlobalStyle = createGlobalStyle<{
	colorTokens: ColorTokens;
	assetTokens: AssetTokens;
}>`
  body, html {
    width: 100%;
    height: 100%;
  }

  html {
    background-color: #000000;
    overflow-x: hidden;
    --scroll-bar: 0;
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

    font-feature-settings: "tnum", "tnum";
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5175;
    margin: 0;
  }
  
  #root {
    flex: 1 0 100%;
  }

  *, :after, :before {
    box-sizing:border-box;
  }

  .ReactCollapse--collapse {
    width: 100%;
  }

  div {
    user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }
  
  a {
    text-decoration: underline dotted;
    color: ${({ colorTokens }) => colorTokens['semantic-color--link-normal']};
    &:hover {
      text-decoration: underline dotted;
      color: ${({ colorTokens }) => colorTokens['semantic-color--link-hover']}
    }
  }

  .rotate {
    animation: rotation 8s infinite linear;
  }
`;

export default GlobalStyle;
