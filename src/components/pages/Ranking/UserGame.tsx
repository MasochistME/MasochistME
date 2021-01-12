import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { colors, fonts, media } from 'shared/theme';
import { Flex } from 'shared/components';
import { ProgressBar } from 'shared/components';

const Game = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 37px;
  align-items: center;
  background-color: ${colors.darkBlueTransparent};
  border-bottom: 1px solid ${colors.newDark};
  border-top: 1px solid ${colors.newMediumGrey};
  &:first-child {
    border-top: none;
  }
  &:last-child {
    border-bottom: none;
  }
`;
const Logo = styled.img`
  margin: 0;
  padding: 0;
  min-height: 37px;
  max-height: 37px;
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;
const Info = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px;
`;
const Times = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.7em;
  font-family: ${fonts.Verdana};
  color: ${colors.superLightGrey};
`;
const CompletionTimer = styled.div`
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;
const Title = styled.div`
  margin-left: 5px;
  &:hover {
    color: ${colors.white};
  }
`;

UserGame.Game = Game;
UserGame.Logo = Logo;
UserGame.Info = Info;
UserGame.Times = Times;
UserGame.Title = Title;
UserGame.CompletionTimer = CompletionTimer;
UserGame.ProgressBar = ProgressBar;

type TUserProps = {
  game: any;
};

export default function UserGame(props: TUserProps): JSX.Element {
  const { game } = props;
  const history = useHistory();
  const percentage = isNaN(Math.floor(game.percentage))
    ? 0
    : Math.floor(game.percentage);

  const onGameClick = () => game?.id && history.push(`/game/${game.id}`);

  return (
    <UserGame.Game>
      <UserGame.Logo src={game.img} alt="logo" />
      <UserGame.Info>
        <Flex row>
          <i className={game.rating} />
          <UserGame.Title onClick={onGameClick}> {game.title}</UserGame.Title>
        </Flex>
        <UserGame.Times>
          {game.percentage === 100 ? (
            <UserGame.CompletionTimer>
              {new Date(game.lastUnlocked * 1000).toLocaleString()}
            </UserGame.CompletionTimer>
          ) : null}
          <div style={{ display: 'none' }}>
            {game.playtime
              ? typeof game.playtime === 'number'
                ? Math.round(game.playtime)
                : Math.round(Number(game.playtime))
              : 0}{' '}
            h
          </div>
        </UserGame.Times>
      </UserGame.Info>
      <UserGame.ProgressBar percentage={percentage} />
    </UserGame.Game>
  );
}
