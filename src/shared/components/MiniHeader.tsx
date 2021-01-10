import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { colors, fonts, media } from 'shared/theme';
import headerImg from 'shared/images/miniheader.png';
import Flex from './layout/Flex';

const StyledMiniHeader = styled.div`
  width: 100%;
  height: 100px;
  padding: 0 20px;
  box-sizing: border-box;
  color: ${colors.superLightGrey};
  font-family: ${fonts.Cinzel};
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 2em;
  background-color: ${colors.superDarkGrey};
  background-image: url(${headerImg});
  background-repeat: no-repeat;
  background-position-x: right;
  background-size: cover;
  p {
    margin: 0;
    text-shadow: 0px 0px 5px ${colors.newDark};
  }
  i {
    margin-right: 20px;
    font-size: 2.3em;
    @media (max-width: ${media.tablets}) {
      display: none;
    }
  }
`;

export default function MiniHeader(): JSX.Element {
  const tabs = useSelector((state: any) => state.tabs);

  const findTab = () => tabs.list.find((tab: any) => tab.link === tabs.active);

  return (
    <StyledMiniHeader>
      <Flex row align style={{ height: '100%' }}>
        <i className={findTab()?.icon ?? 'fas fa-question-circle'} />
        <p>{findTab()?.text ?? '404'}</p>
      </Flex>
    </StyledMiniHeader>
  );
}
