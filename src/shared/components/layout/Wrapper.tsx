import React from 'react';
import styled from 'styled-components';
import { colors, fonts, media } from 'shared/theme';
import backgroundImg from 'shared/images/bg.jpg';

type WrapperProps = {
  type: string;
  children?: React.ReactNode;
};

const WrapperMain = styled.div`
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
  font-family: ${fonts.fontRaleway};
  text-align: justify;
`;

const WrapperNav = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${colors.superDarkGrey};
  box-shadow: 0 0 30px ${colors.newDark};
  color: ${colors.superLightGrey};
  font-family: ${fonts.fontRaleway};
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
    li {
      border-right: 3px solid ${colors.newDark};
      height: 100%;
      width: 20%;
      box-sizing: border-box;
      &:hover {
        background-color: ${colors.newDark};
        cursor: pointer;
      }
      &.tab-active {
        background-color: ${colors.newDark};
      }
      p {
        margin: 10px 0 0 0;
        @media (max-width: ${media.tablets}) {
          display: none;
        }
      }
      i {
        font-size: 1.4em;
      }
    }
  }
`;

const WrapperMiddle = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1500px;
  height: auto;
`;

export default function Wrapper(props: WrapperProps): JSX.Element {
  const { type, children } = props;
  if (type === 'nav') {
    return <WrapperNav>{children}</WrapperNav>;
  }
  if (type === 'middle') {
    return <WrapperMiddle>{children}</WrapperMiddle>;
  }
  if (type === 'main') {
    return <WrapperMain>{children}</WrapperMain>;
  }
  return <div className={`wrapper-${type}`}>{children}</div>;
}
