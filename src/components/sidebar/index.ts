import styled from 'styled-components';

import SectionUpdate from './Sections/SectionUpdate';
import SectionHistory from './Sections/SectionHistory';
import SectionTop from './Sections/SectionTop';
import SectionTrivia from './Sections/SectionTrivia';
import SectionSale from './Sections/SectionSale';

export {
  SectionUpdate,
  SectionHistory,
  SectionTop,
  SectionTrivia,
  SectionSale,
};

export type TSection = 'update' | 'trivia' | 'top' | 'history' | 'sales';

export const Section = styled.div`
  padding-bottom: 10px;
  width: 100%;
  margin-bottom: 30px;
  box-sizing: border-box;
  box-shadow: 0 0 20px $newdark;
  background-color: rgba($superlightgrey, 0.7);
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
    background-color: $black;
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
  font-family: $font-dosis;
  text-transform: uppercase;
  background-color: rgba($newdark, 0.8);
  color: $superlightgrey;
`;

export const UpdateProgressBar = styled.div`
  position: absolute;
  width: 0%;
  height: 100%;
  padding: 0 !important;
  align-self: flex-start;
  background-color: $newmediumgrey;
`;

export const UpdateProgressBarBorder = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  height: 40px;
  padding: 0 !important;
  background-color: $superdarkgrey;
`;

export const UpdateProgressBarPercentage = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $superlightgrey;
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

export const SaleBrick = styled.div`
  cursor: pointer;
  background-size: contain;
  box-sizing: border-box;
  width: 192px;
  height: 92px;
  margin: 5px;
  &:hover {
    box-shadow: 0 0 10px $superdarkgrey;
  }
`;

export const SaleLink = styled.a`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  &.link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35%;
    height: 40%;
    text-decoration: none;
    font-family: $font-dosis;
    font-weight: bold;
    color: $superlightgrey;
    background-color: $darkblue;
    box-shadow: -2px 2px 5px $superdarkgrey;
    font-size: 1.2em;
  }
  &:hover {
    text-decoration: none;
  }
`;

export const UpdateButton = styled.div`
  width: 50%;
`;
