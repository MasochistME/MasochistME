import React, { useState } from 'react';
import styled from 'styled-components';
import { swapRatingToIcon } from 'shared/helpers/helper';
import { colors } from 'shared/theme';
import Leaderboards from '../Leaderboards/index';

const StyledGame = styled.div.attrs(({ extended }: { extended?: boolean }) => {
  const style = extended
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${colors.newDark}dd`,
      }
    : {};
  return { style };
})<{ extended?: boolean }>``;

Game.Info = styled.div`
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
Game.Desc = styled.div`
  font-size: 0.85em;
`;
Game.Title = styled.div``;
Game.Rating = styled.div``;
Game.Img = styled.div.attrs(
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

type TGame = {
  game: any;
  rating: any;
};

export default function Game(props: TGame): JSX.Element {
  const { game, rating } = props;
  const [extended, setExtended] = useState(false);

  const onExtend = (event: any) => {
    event.cancelBubble = true;
    setExtended(!extended);
  };

  return (
    <StyledGame onClick={onExtend}>
      <Game.Img
        className={`rated-${game.rating}`}
        extended={extended}
        src={game?.img}>
        <Game.Info>
          <Game.Rating>
            <i
              className={
                game ? swapRatingToIcon(game.rating, rating) : 'fas fa-spinner'
              }></i>
          </Game.Rating>
          <Game.Title>{game.title}</Game.Title>
          <Game.Desc>{game.desc}</Game.Desc>
        </Game.Info>
      </Game.Img>
      <Leaderboards show={extended} game={game} rating={game.rating} />
    </StyledGame>
  );
}
