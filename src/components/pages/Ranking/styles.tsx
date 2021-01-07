import styled from 'styled-components';
import { colors, media } from 'shared/theme';

type TSummary = {
  disabled?: boolean;
  shekelmaster?: boolean;
};

export const Summary = styled.div.attrs(
  ({ disabled, shekelmaster }: TSummary) => {
    const style: any = {};
    if (shekelmaster) {
      style.backgroundColor = colors.tier4Transparent;
      style.border = `1px solid ${colors.tier4Muted}`;
    }
    if (disabled) {
      style.backgroundColor = colors.darkRedTransparent;
    }
    return { style };
  },
)<TSummary>`
  width: 100%;
  min-height: 32px;
  background-color: ${colors.darkBlueTransparent};
  border-bottom: 1px solid ${colors.newDark};
  border-top: 1px solid ${colors.newMediumGrey};
`;

export const Position = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  max-width: 64px;
  height: 100%;
  text-align: center;
  font-size: 1.2em;
  border-right: 1px solid ${colors.newDark};
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;

export const Avatar = styled.img`
  min-width: 64px;
  min-height: 64px;
  max-width: 64px;
  max-height: 64px;
  box-sizing: border-box;
  padding: 5px;
  border-left: 1px solid ${colors.newMediumGrey};
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;

export const Icons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PatronIcon = styled.i.attrs(({ tier }: { tier?: number }) => {
  // @ts-ignore
  const color: string = colors[`tier${tier}`];
  const style: any = {};
  if (color) {
    style.textShadow = `0 0 5px ${color}`;
  }
  return { style };
})<{ tier?: number }>`
  margin-left: 10px;
  cursor: help;
  color: ${colors.superDarkGrey};
  font-size: 1.3em;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  width: 100%;
  max-width: 90%;
  @media (max-width: ${media.tablets}) {
    max-width: 100%;
    padding: 0 5px;
  }
`;

export const RatingScore = styled.div`
  display: flex;
  padding: 5px;
  width: 50px;
  justify-content: space-evenly;
  @media (max-width: ${media.netbooks}) {
    padding: 5px 0;
  }
`;

export const Name = styled.div.attrs(
  ({ shekelmaster }: { shekelmaster?: boolean }) => {
    const style: any = {};
    if (shekelmaster) {
      style.color = colors.tier4;
    }
    return { style };
  },
)<{ shekelmaster?: boolean; tier: number }>`
  text-transform: uppercase;
`;

export const Ranking = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: ${media.tablets}) {
    display: none !important;
  }
`;

export const Display = styled.div.attrs(({ show }: { show?: boolean }) => {
  const style: any = {};
  if (show) {
    style.display = 'flex !important';
    style.transition = 'height 1s';
    style.height = 'auto';
  } else {
    style.display = 'none !important';
    style.height = 0;
  }
  return { style };
})<{ show?: boolean }>`
  width: 100%;
  padding: 0 55px;
  box-sizing: border-box;
  &:first-child {
    border-top: none;
  }
  @media (max-width: ${media.smallNetbooks}) {
    padding: 0;
  }
`;

export const DetailsSummary = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  background-color: ${colors.darkBlueTransparent};
  @media (min-width: ${media.tablets}) {
    display: none !important;
  }
`;
