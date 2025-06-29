import { Flex, Modal } from 'components';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';
import { ModalRaceHeader } from './ModalRaceHeader';
import { ModalRaceLeaderboards } from './ModalRaceLeaderboards';

type Props = {
  raceId: string | null;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

export const ModalRace = (props: Props): JSX.Element | null => {
  const { raceId, isModalOpen, setIsModalOpen } = props;
  const { colorTokens } = useTheme();

  return (
    <Modal
      isModalOpen={isModalOpen && !!raceId}
      setIsModalOpen={setIsModalOpen}>
      <WrapperRace column colorTokens={colorTokens}>
        <ModalRaceHeader raceId={raceId} />
        <ModalRaceLeaderboards raceId={raceId} />
      </WrapperRace>
    </Modal>
  );
};

export const WrapperRace = styled(Flex)<{ colorTokens: ColorTokens }>`
  box-sizing: border-box;
  text-align: center;
  width: 60rem;
  max-width: 100%;
  height: auto;
  gap: var(--size-16);
  background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}ee;
  color: ${({ colorTokens }) => colorTokens['core-primary-text']};
  font-family: var(--font-raleway);
  /* padding: var(--size-16); */
`;
