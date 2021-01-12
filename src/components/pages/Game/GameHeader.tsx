import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Spinner, Wrapper } from 'shared/components';
import { Basic, Image, EmptyImage } from './styles';

GameHeader.Image = Image;
GameHeader.Basic = Basic;
GameHeader.EmptyImage = EmptyImage;

export default function GameHeader(props: { game: any }): JSX.Element {
  const { game } = props;
  const gameRating = useSelector(
    (state: any) =>
      state.rating &&
      state.rating.find((r: any) =>
        game ? Number(r.id) === Number(game.rating) : null,
      ),
  );

  return (
    <Wrapper type="description">
      <div
        className="page-description"
        style={{ paddingBottom: '0', marginBottom: '0' }}>
        <Flex
          row
          align
          style={{ justifyContent: 'space-between', marginBottom: '10px' }}>
          <h1 style={{ margin: '0' }}>
            <a
              href={`https://steamcommunity.com/app/${game?.id}`}
              target="_blank"
              rel="noopener noreferrer">
              <i className="fab fa-steam" style={{ marginRight: '10px' }} />
              {game?.title ?? 'Loading...'}
            </a>
          </h1>
          <div>
            <i className={gameRating?.icon ?? 'far fa-question-circle'}></i>
          </div>
        </Flex>
        <GameHeader.Basic>
          {game?.img ? (
            <GameHeader.Image src={game?.img} />
          ) : (
            <GameHeader.EmptyImage>
              <Spinner />
            </GameHeader.EmptyImage>
          )}
          <div style={{ fontSize: '1.3em', textAlign: 'center' }}>
            {game?.desc ?? 'Loading...'}
          </div>
          <div />
        </GameHeader.Basic>
      </div>
    </Wrapper>
  );
}
