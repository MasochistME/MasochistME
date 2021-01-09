import React from 'react';
import styled from 'styled-components';
import { colors, fonts, media } from 'shared/theme';

const Completion = styled.div`
  position: relative;
  min-width: 200px;
  height: 15px;
  margin-right: 7px;
  border: 1px solid ${colors.newDark};
  background-color: ${colors.newDark}77;
  @media (max-width: ${media.smallTablets}) {
    border: none;
    min-width: 100px;
  }
`;
const Progress = styled.div.attrs(({ percentage }: { percentage: number }) => {
  return {
    style: {
      width: `${percentage * 2}px`,
    },
  };
})<{ percentage: number }>`
  position: absolute;
  height: 100%;
  background-color: ${colors.newMediumGrey};
  @media (max-width: ${media.smallTablets}) {
    display: none;
  }
`;
const Percentage = styled.div`
  position: absolute;
  width: 100%;
  font-size: 0.77em;
  font-family: ${fonts.Verdana};
  letter-spacing: 0.1em;
  text-align: center;
`;

UserGameProgressBar.Completion = Completion;
UserGameProgressBar.Progress = Progress;
UserGameProgressBar.Percentage = Percentage;

type Props = {
  percentage: number;
};

export default function UserGameProgressBar(props: Props): JSX.Element {
  const { percentage } = props;
  return (
    <UserGameProgressBar.Completion>
      <UserGameProgressBar.Progress percentage={percentage} />
      <UserGameProgressBar.Percentage>
        {percentage}%
      </UserGameProgressBar.Percentage>
    </UserGameProgressBar.Completion>
  );
}
