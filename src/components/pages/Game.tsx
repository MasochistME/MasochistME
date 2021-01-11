import React from 'react';
// import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Flex, Spinner } from 'shared/components';
import Leaderboards from './Leaderboards';

const WrapperGame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export default function PageGame(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const game = useSelector((state: any) =>
    state.games.list.find((g: any) => Number(g.id) === Number(id)),
  );

  return (
    <Flex column>
      {/* <Wrapper type="description">
        <div className="page-description"></div>
      </Wrapper> */}
      <WrapperGame>
        {game ? <Leaderboards id={id} rating={game.rating} /> : <Spinner />}
      </WrapperGame>
    </Flex>
  );
}
