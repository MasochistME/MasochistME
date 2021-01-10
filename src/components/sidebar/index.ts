import styled from 'styled-components';

import { colors, fonts } from 'shared/theme';

import SectionUpdate from './Sections/SectionUpdate';
import SectionHistory from './Sections/SectionHistory';
import SectionTop from './Sections/SectionTop';
import SectionTrivia from './Sections/SectionTrivia';
import SectionSale from './Sections/SectionSale';
import SectionDiscord from './Sections/SectionDiscord';

export {
  SectionUpdate,
  SectionHistory,
  SectionTop,
  SectionTrivia,
  SectionSale,
  SectionDiscord,
};

export type TSection =
  | 'update'
  | 'trivia'
  | 'top'
  | 'history'
  | 'sales'
  | 'discord';

export const Section = styled.div`
  padding-bottom: 10px;
  width: 100%;
  margin-bottom: 30px;
  box-sizing: border-box;
  box-shadow: 0 0 20px ${colors.newDark};
  background-color: ${colors.superLightGrey}bb;
  div,
  p,
  ol,
  ul {
    padding: 0 15px;
  }
  p,
  ul {
    margin: 2px 0;
  }
  &:first-child {
    background-color: ${colors.black};
    height: 100px;
  }
`;

export const SectionTitle = styled.h3`
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
  background-color: ${colors.newDark}cc;
  color: ${colors.superLightGrey};
`;

export const UpdateProgressBar = styled.div`
  position: absolute;
  width: 0%;
  height: 100%;
  padding: 0 !important;
  align-self: flex-start;
  background-color: ${colors.newMediumGrey};
`;

export const UpdateProgressBarBorder = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  height: 40px;
  padding: 0 !important;
  background-color: ${colors.superDarkGrey};
`;

export const UpdateProgressBarPercentage = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.superLightGrey};
`;

export const SmallEvent = styled.p`
  width: 100%;
  padding: 3px;
  margin-bottom: 1px;
  box-sizing: border-box;
`;

export const SmallMember = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 3px;
  margin-bottom: 1px;
`;

export const MemberLink = styled.span`
  cursor: pointer;
  &:hover {
    color: ${colors.newMediumGrey};
  }
`;

export const SaleBrick = styled.li`
  cursor: pointer;
  background-size: contain;
  box-sizing: border-box;
  width: 192px;
  height: 92px;
  margin: 5px;
  &:hover {
    box-shadow: 0 0 10px ${colors.superDarkGrey};
  }
`;

export const SaleLink = styled.a`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  &:hover {
    text-decoration: none;
  }
`;

export const SalePercentage = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35%;
  height: 40%;
  text-decoration: none;
  font-family: ${fonts.Dosis};
  font-weight: bold;
  color: ${colors.superLightGrey};
  background-color: ${colors.darkBlue};
  box-shadow: -2px 2px 5px ${colors.superDarkGrey};
  font-size: 1.2em;
`;

export const UpdateButton = styled.div`
  width: 50%;
`;
