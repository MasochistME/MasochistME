import { Flex } from 'components';
import { GraphAvgCompletion } from './GraphAvgCompletion';
import { GraphPlaytimeScatter } from './GraphPlaytimeScatter';

type Props = {
  gameId: number;
};

export const GameProfileGraphs = (props: Props) => {
  const { gameId } = props;

  return (
    <Flex justify flexWrap="wrap" width="100%" gap={16}>
      <GraphAvgCompletion gameId={gameId} />
      <GraphPlaytimeScatter gameId={gameId} />
    </Flex>
  );
};
