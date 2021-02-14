import React from 'react';
import styled from 'styled-components';
import { colors, fonts, media } from 'shared/theme';
import backgroundImg from 'shared/images/bg.jpg';

type WrapperProps = {
  type: string;
  children?: React.ReactNode;
  style?: any;
};

const WrapperMain = styled.div.attrs(({ style }: { style?: any }) => {
  if (style) {
    return { style };
  }
})<{ style?: any }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${backgroundImg});
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: auto;
  min-height: 100vh;
  font-family: ${fonts.Raleway};
  text-align: justify;
`;

const WrapperPage = styled.div.attrs(({ style }: { style?: any }) => {
  if (style) {
    return { style };
  }
})<{ style?: any }>`
  display: flex;
  flex-direction: row;
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

const WrapperNav = styled.div.attrs(({ style }: { style?: any }) => {
  if (style) {
    return { style };
  }
})<{ style?: any }>`
  width: 100%;
  height: 100px;
  background-color: ${colors.superDarkGrey};
  box-shadow: 0 0 30px ${colors.newDark};
  color: ${colors.superLightGrey};
  font-family: ${fonts.Raleway};
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: sticky;
  top: 0px;
  z-index: 1000;
  @media (max-width: ${media.tablets}) {
    height: 50px;
  }
  ul {
    margin: 0;
    padding: 0;
    height: 100%;
    list-style-type: none;
  }
`;

const WrapperMiddle = styled.div.attrs(({ style }: { style?: any }) => {
  if (style) {
    return { style };
  }
})<{ style?: any }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1500px;
  height: auto;
`;

const WrapperDescription = styled.div.attrs(({ style }: { style?: any }) => {
  if (style) {
    return { style };
  }
})<{ style?: any }>`
  padding: 10px;
  box-sizing: border-box;
  background-color: ${colors.darkBlueTransparent};
  width: 100%;

  p {
    margin: 0 0 10px 0;
  }

  .fancy {
    margin-bottom: 10px;
    padding: 0;
    box-sizing: border-box;
    color: ${colors.superDarkGrey};
    box-shadow: 0 0 20px ${colors.superDarkGrey};
    background-color: ${colors.superLightGrey}aa;
    h3 {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30px;
      padding: 0;
      margin: 0 0 10px 0;
      font-size: 1.3em;
      font-family: ${fonts.Dosis};
      text-transform: uppercase;
      background-color: ${colors.newDark}dd;
      color: ${colors.superLightGrey};
    }
  }
`;

export default function Wrapper(props: WrapperProps): JSX.Element {
  const { type, children, style } = props;
  if (type === 'nav') {
    return <WrapperNav style={style}>{children}</WrapperNav>;
  }
  if (type === 'middle') {
    return <WrapperMiddle style={style}>{children}</WrapperMiddle>;
  }
  if (type === 'main') {
    return <WrapperMain style={style}>{children}</WrapperMain>;
  }
  if (type === 'description') {
    return <WrapperDescription style={style}>{children}</WrapperDescription>;
  }
  if (type === 'page') {
    return <WrapperPage style={style}>{children}</WrapperPage>;
  }
  return <div className={`wrapper-${type}`}>{children}</div>;
}
