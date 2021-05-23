import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';

export const InputDescription = styled.input`
  width: 100%;
  background-color: transparent;
  font-size: 16px;
  font-family: ${fonts.Raleway};
  color: ${colors.superLightGrey};
  border: none;
`;

export const Patron = styled.div`
  cursor: help;
`;

export const UpdateDate = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8em;
  margin-bottom: 5px;
`;

export const Avatar = styled.img.attrs(({ tier }: { tier: number }) => {
  const style: any = {
    backgroundColor: colors.black,
  };
  if (tier === 1) {
    style.border = `5px solid ${colors.tier1}`;
  }
  if (tier === 2) {
    style.border = `5px solid ${colors.tier2}`;
  }
  if (tier === 3) {
    style.border = `5px solid ${colors.tier3}`;
  }
  if (tier === 4) {
    style.border = `5px solid ${colors.tier4}`;
  }
  return { style };
})<{ tier: number }>`
  width: 128px;
  min-width: 128px;
  height: 128px;
  min-height: 128px;
  margin: 15px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 10px ${colors.black};
  padding: 2px;
`;

export const EmptyAvatar = styled.div`
  width: 128px;
  min-width: 128px;
  height: 128px;
  min-height: 128px;
  margin: 15px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 10px ${colors.black};
  background-color: ${colors.black};
  padding: 2px;
`;

export const Basic = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.superDarkGrey}48;
  margin-bottom: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  height: 100%;
  box-shadow: 0 0 5px ${colors.superDarkGrey};
  border-bottom: 1px solid ${colors.mediumGrey};
  border-right: 1px solid ${colors.mediumGrey};
  border-left: 1px solid ${colors.superDarkGrey};
  border-top: 1px solid ${colors.superDarkGrey};
`;

export const UpdateMsg = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
`;
