import styled from 'styled-components';
import { media } from 'shared/theme';

export const EventInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

export const EventImg = styled.img`
  height: 35px;
  max-height: 35px;
  margin: 0 5px;
`;

export const EventDescription = styled.div`
  width: 100%;
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;

export const EventSummary = styled.div`
  display: flex;
  flex-direction: row;
  & > * {
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & > i {
    width: 20px;
    box-sizing: border-box;
  }

  /* .event-summary > *
  margin: 0 5px
  display: flex
  justify-content: center
  align-items: center
  .event-summary > i
  width: 20px
  box-sizing: border-box */
`;
