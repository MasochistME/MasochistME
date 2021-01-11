import styled from 'styled-components';
import { colors, media, fonts } from 'shared/theme';

export const WrapperLeaderboards = styled.div`
  display: block;
  box-sizing: border-box;
  text-align: center;
  padding: 10px;
  width: 100%;
  width: 700px;
  max-width: 90%;
  height: auto;
  max-height: 90%;
  overflow-y: auto;
  background-color: ${colors.darkBlueTransparent};
  color: ${colors.superLightGrey};
  font-family: ${fonts.Raleway};
  h2 {
    border-bottom: 1px solid ${colors.newMediumGrey};
    padding-bottom: 10px;
    margin: 10px;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 10px;
  }
`;

export const Description = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${colors.superDarkGrey}33;
  box-sizing: border-box;
  box-shadow: 0 0 5px ${colors.superDarkGrey};
  border-bottom: 1px solid ${colors.mediumGrey};
  border-right: 1px solid ${colors.mediumGrey};
  border-left: 1px solid ${colors.superDarkGrey};
  border-top: 1px solid ${colors.superDarkGrey};
  padding: 20px 5px 30px 5px;
  margin-top: 10px;
`;

export const Field = styled.p`
  margin: 1px !important;
  width: 100%;
  text-align: left;
`;

export const BadgeImg = styled.img`
  border-radius: 10px;
  border: 3px solid ${colors.superLightGrey};
  box-sizing: border-box;
  width: 64px;
  height: 64px;
  min-width: 64px;
  min-height: 64px;
  cursor: help;
  box-shadow: 0 0 5px ${colors.superDarkGrey};
  margin: 10px;
`;

export const User = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${colors.newDark};
  border-top: 1px solid ${colors.newMediumGrey};
  img {
    margin: 2px;
    padding: 0;
    max-height: 35px;
    min-height: 35px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0 10px;
  justify-content: space-between;
`;

export const UserName = styled.div`
  @media (max-width: ${media.bigPhones}) {
    display: none;
  }
`;

export const UserTimes = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.7em;
  font-family: ${fonts.Verdana};
  color: ${colors.superLightGrey};
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;

export const Link = styled.span`
  cursor: pointer;
  &:hover {
    color: ${colors.white};
  }
`;

export const Info = styled.div`
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0);
  color: ${colors.superLightGrey};
  transition: background-color linear 0.5s, opacity 0.5s;
  &:hover {
    opacity: 1;
    background-color: ${colors.superDarkGrey}dd;
  }
`;

// -----------------------------------------------
// --------------------- GAME --------------------
// -----------------------------------------------
export const Desc = styled.div`
  font-size: 0.85em;
`;

export const Title = styled.div``;

export const Rating = styled.div``;

export const Img = styled.div.attrs(
  ({ extended, src }: { extended?: boolean; src: string }) => {
    const style: any = {
      backgroundImage: `url(${src})`,
    };
    if (extended) {
      style.display = 'none';
    }
    return { style };
  },
)<{ extended?: boolean; src: string }>`
  display: block;
  width: 300px;
  height: 145px;
  margin: 5px;
  background-size: 300px;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  border: 3px solid ${colors.superLightGrey};
  box-sizing: border-box;
  cursor: pointer;
  transition: background-size ease-out 0.5s;
  &:hover {
    background-size: 400px;
  }
`;
